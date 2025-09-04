import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MembersService } from 'src/members/members.service';
import { AuthService } from './auth.service';
import { LineProfileRes } from 'src/shared/types/auth';
import ms from 'ms';
import { decode } from 'jsonwebtoken';
import axios, { isAxiosError } from 'axios';
import {
  CreateLineAccount,
  JwtUserType,
  LineSigninRequestDto,
  LineSignupRequestDto,
  MemberResponseDto,
  MemberSignInResponseDTO,
  MemberStatus,
  MemberType,
  MergeAccount,
} from '@repo/shared';
import { CustomException } from 'src/common/exception/custom.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LineService {
  constructor(
    private readonly authService: AuthService,
    private readonly membersService: MembersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sign in via OAUTH and if user has not created an account before we create
   * a new member for them.
   **/
  async lineSignIn(
    lineSignInRequestDto: LineSigninRequestDto,
  ): Promise<MemberSignInResponseDTO | CreateLineAccount> {
    const { code } = lineSignInRequestDto;

    const lineVerifyAPIEndpoint = this.configService.get('LINE_TOKEN_URL');

    // Verify LINE access token via LINE's API

    // create payload
    // generates a string like:
    // grant_type=authorization_code&code=abc123&redirect_uri=http://localhost:3002/callback&client_id=your-client-id&client_secret=your-client-secret
    // required or line api
    const url_encoded_payload = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.configService.get('LINE_REDIRECT_URI'),
      client_id: this.configService.get('LINE_CHANNEL_ID'),
      client_secret: this.configService.get('LINE_CHANNEL_SECRET'),
    });

    let id_token: string;
    let lineAccessToken: string;

    try {
      const response = await axios.post<{
        id_token: string;
        access_token: string;
      }>(lineVerifyAPIEndpoint, url_encoded_payload);
      id_token = response.data?.id_token;
      lineAccessToken = response.data?.access_token;

      console.log('lineAccessToken:', lineAccessToken);
    } catch (err) {
      console.log('Error when attempting to authenticate line code:\n', err);

      // expected error
      if (isAxiosError(err)) {
        throw new CustomException(
          JSON.stringify(err.response.data),
          HttpStatus.UNAUTHORIZED,
        );
      }

      // unexpected server error
      throw new CustomException(
        'Unknown error when attempting to swap code for line tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // access token authorization failed during line oauth, reject user sign in / creation
    if (!lineAccessToken) {
      throw new CustomException(
        'Could not authenticate via line oauth.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const profile = await this.getLineProfile(lineAccessToken);

    const { userId: lineId } = profile;

    // check if member exists with this LINE ID
    const member = await this.membersService.findMemberByLineId(lineId);

    if (member?.status === MemberStatus.INACTIVE) {
      throw new CustomException('此帳號已停用', HttpStatus.BAD_REQUEST);
    }

    // prevent line-only accounts from attempting to bind line account
    // if (member?.type === MemberType.L) {
    //   throw new CustomException(
    //     'Line-only accounts cannot bind with another line account.',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // --- FIRST TIME line account sign in ---
    if (!member) {
      // return that the user needs to provide more info
      // for creating a new account

      const decodedToken = decode(id_token) as { email?: string };
      const lineEmail = decodedToken.email;

      console.log('Line Decoded Email:', lineEmail);

      const emailMatched =
        await this.membersService.findMemberByEmail(lineEmail);

      // -- email account with the same email does not exists --

      if (!emailMatched) {
        return {
          status: MergeAccount.CREATE_ACCOUNT, // create new account
          access_token: lineAccessToken,
          id_token: id_token,
        };
      }

      // -- email account with the same email exists --

      if (emailMatched) {
        console.log('Email matched, merging accounts');
        const profile = await this.getLineProfile(lineAccessToken);

        const {
          userId: lineId,
          displayName: lineName,
          pictureUrl: avatar,
        } = profile;

        const updatedMember =
          await this.membersService.updateExistingMemberById(emailMatched.id, {
            lineId: lineId,
            lineName: lineName,
            avatar,
          });

        const { accessToken, refreshToken } =
          await this.authService.generateJwtToken(
            updatedMember,
            JwtUserType.MEMBER,
          );

        return {
          userInfo: updatedMember,
          accessToken,
          refreshToken,
          expiresIn: ms(this.authService.ACCESS_EXPIRE_IN),
          refreshExpiresIn: ms(this.authService.REFRESH_EXPIRE_IN),
        };
      }
    }

    // --- EXISTING line account sign in ---

    // generate and return access and refresh tokens
    // if successful, generate jwt token and return user
    const { accessToken, refreshToken } =
      await this.authService.generateJwtToken(member, JwtUserType.MEMBER);

    delete member.password;

    // message
    return {
      userInfo: member,
      accessToken,
      refreshToken,
      expiresIn: ms(this.authService.ACCESS_EXPIRE_IN),
      refreshExpiresIn: ms(this.authService.REFRESH_EXPIRE_IN),
    };
  }

  /**
   * Signs up as a new member in the case that they aren't a member and doesn't already have
   * the same email account (for creating joined account).
   **/
  async lineSignUp(
    lineSignUpRequestDto: LineSignupRequestDto,
  ): Promise<MemberSignInResponseDTO> {
    // destructure create member-only props
    const {
      access_token: lineAccessToken,
      id_token,
      name,
      birthday,
      phone,
    } = lineSignUpRequestDto;

    // get token from id token
    const decodedToken = decode(id_token) as { email?: string };
    const lineEmail = decodedToken.email;

    // authenticate and get profile info via line api
    const profile = await this.getLineProfile(lineAccessToken);

    const {
      userId: lineId,
      displayName: lineName,
      pictureUrl: avatar,
    } = profile;

    // check if member does not exist with this LINE ID
    const member = await this.membersService.findMemberByLineId(lineId);

    if (member) {
      throw new CustomException(
        'Member already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    let newMember: MemberResponseDto;

    // check member is already an email member, and join accounts instead of creating a new one
    const emailAccount = await this.membersService.findMemberByEmail(lineEmail);

    if (emailAccount) {
      // --- merge account into one ---
      newMember = await this.membersService.updateExistingMemberById(
        emailAccount.id,
        {
          lineId: lineId,
          lineName: lineName,
          avatar,
          name,
          birthday,
          phone,
        },
      );
    } else {
      // --- create brand new account ---
      newMember = await this.membersService.createLineMember({
        lineId,
        lineName,
        avatar,
        name,
        birthday,
        phone,
        email: lineEmail,
      });
    }

    // generate and return access and refresh tokens
    // if successful, generate jwt token and return user
    const { accessToken, refreshToken } =
      await this.authService.generateJwtToken(newMember, JwtUserType.MEMBER);

    return {
      userInfo: newMember,
      accessToken,
      refreshToken,
      expiresIn: ms(this.authService.ACCESS_EXPIRE_IN),
      refreshExpiresIn: ms(this.authService.REFRESH_EXPIRE_IN),
    };
  }

  /**
   * Fetches the user's profile using the LINE access token.
   **/
  async getLineProfile(accessToken: string): Promise<LineProfileRes> {
    const profileUrl = this.configService.get('LINE_PROFILE_URL');
    try {
      const response = await axios.get(profileUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log('Line profile api response:', response.data);
      return response.data;
    } catch (error) {
      console.log('getLineProfile error', error);
      throw new CustomException(
        'Failed to get LINE profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Check if a line member is connected with line OA account.
   **/
  async checkMemberLinkedToLineOA(lineId: string): Promise<boolean> {
    const lineOAUrl = this.configService.get('LINE_OA_VERIFICATION_ENDPOINT');
    // Call LINE Messaging API to check if user is added to OA
    try {
      const response = await axios.get(`${lineOAUrl}/${lineId}`);

      console.log('lineoa reponse:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking LINE OA status:', error);
      return false;
    }
  }

  /**
   * Unbinds an existing line account form their member account.
   **/
  async unbindLineAccount(userId: string): Promise<MemberResponseDto> {
    // check if member account type is Email, can't unbind line from line account
    console.log('finding member with id:', userId);
    const member = await this.membersService.findMemberById(userId);

    if (member.type !== MemberType.E) {
      throw new CustomException(
        "Can't unbind line account from an non-email account.",
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if line information even exists
    const lineExists = member.lineId && member.lineName;

    if (!lineExists) {
      throw new CustomException(
        "Can't unbind line account because this account has not been bound to any line accounts.",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // remove line related fields
      const updatedMember = await this.membersService.updateExistingMemberById(
        userId,
        {
          lineId: null,
          lineOa: null,
          lineName: null,
        },
      );

      return plainToInstance(MemberResponseDto, updatedMember);
    } catch (err) {
      throw new CustomException(
        'Error when attempting to unbind line account.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
