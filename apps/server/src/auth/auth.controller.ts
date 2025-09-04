import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomRequest } from 'src/shared/interfaces/custom-request';

import {
  HttpStatusCode,
  SignInRequestDTO,
  UpdatePasswordRequestDTO,
  GetPermissionRequestDTO,
  GetPermissionResponseDTO,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
  MemberSignInDTO,
  LineSigninRequestDto,
  LineSignupRequestDto,
  CreateLineAccount,
  CreateMemberRequestDto,
  UpdatePasswordByForgotRequestDTO,
  ForgotRequestDTO,
} from '@repo/shared';
import { SignInResponseDTO } from '@repo/shared';
import { AuthGuard } from 'src/guards/auth.guard';
import { LineService } from './line.service';
import { ClientAuthGuard } from 'src/guards/client-auth.guard';

// custom type guard to check if result is the type that prompts for client to create an account
function isCreateLineAccount(result: any): result is CreateLineAccount {
  return 'status' in result && result.status === 'CREATE_ACCOUNT';
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private lineService: LineService,
  ) {}

  /********************************************
   *             -- ADMIN USER --             *
   ********************************************/

  @Post('signin')
  async signIn(
    @Body() body: SignInRequestDTO,
    @Req() request: CustomRequest,
  ): Promise<SignInResponseDTO> {
    const res = await this.authService.signIn(body);
    request.httpCode = HttpStatusCode.OK;
    // throw new CustomException('登入失敗', HttpStatus.BAD_REQUEST);
    return res;
  }

  @Get('sign-out')
  @UseGuards(AuthGuard)
  async signOut(@Req() request: CustomRequest) {
    const userId = request['user'].sub;
    return await this.authService.signOut(userId);
  }

  @Get('reset-tokens')
  async getResetIds() {
    return this.authService.getResetTokens();
  }

  @Post('forgot')
  async forgot(
    @Body() requestData: ForgotRequestDTO,
    @Req() request: CustomRequest,
  ) {
    request.httpCode = HttpStatusCode.OK;
    return await this.authService.forgotAdminPassword(requestData);
  }

  @Get('check-reset-token/:token')
  async checkResetToken(@Param('token') token: string) {
    return await this.authService.checkResetToken(token);
  }

  @Post('refresh')
  async refreshAccessToken(
    @Body() { refreshToken }: RefreshTokenRequestDTO,
    @Req() request: CustomRequest,
  ): Promise<RefreshTokenResponseDTO> {
    request.httpCode = HttpStatusCode.OK;
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Patch('update-password')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Body() updateData: UpdatePasswordRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.authService.updatePassword(updateData, userId);
  }

  @Patch('update-password-by-forgot')
  async updatePasswordByForgot(
    @Body() updateData: UpdatePasswordByForgotRequestDTO,
  ) {
    return this.authService.updatePasswordByForgot(updateData);
  }

  @Post('user-permission')
  @UseGuards(AuthGuard)
  async getUserPermissionMenus(
    @Body() Body: GetPermissionRequestDTO,
    @Req() request: CustomRequest,
  ): Promise<GetPermissionResponseDTO> {
    // get user id from request as sub (added suring signing token),
    // check AuthGuard canActivate method
    const userId = request['user'].sub;

    request.httpCode = HttpStatusCode.OK;
    return this.authService.getUserPermissionMenus(Body, userId);
  }

  /********************************************
   *        -- MEMBER (CLIENT USER) --        *
   ********************************************/

  /**
   * Sign Up via Line OAUTH.
   **/
  @Post('member/signup')
  async memberEmailSignUp(
    @Body() memberEmailSignUpDto: CreateMemberRequestDto,
    @Req() request: CustomRequest,
  ) {
    request.httpCode = HttpStatusCode.OK;
    request.message = 'Successfully created member.';
    return this.authService.memberEmailSignUp(memberEmailSignUpDto);
  }

  /**
   * Standard member sign in with Email
   **/
  @Post('member/signin')
  async memberSignIn(
    @Body() MemberSignInDTO: MemberSignInDTO,
    @Req() request: CustomRequest,
  ) {
    request.httpCode = HttpStatusCode.OK;
    request.message = 'Successfully authenticated member.';
    return this.authService.memberEmailSignIn(MemberSignInDTO);
  }

  /**
   * Sign In via Line OAUTH.
   **/
  @Post('member/line-signin')
  async memberLineSignIn(
    @Body() lineSigninRequestDto: LineSigninRequestDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.lineService.lineSignIn(lineSigninRequestDto);

    req.httpCode = HttpStatusCode.OK;
    // accessToken missing indicates new user, add detail to message.
    if (isCreateLineAccount(result)) {
      req.message =
        'Successfully authenticated line account, please create new member.';
    }

    return result;
  }

  /**
   * Member Sign Up after Line OAUTH success.
   **/
  @Post('member/line-signup')
  async memberLineSignUp(
    @Body() lineSignUpRequestDto: LineSignupRequestDto,
    @Req() request: CustomRequest,
  ) {
    request.httpCode = HttpStatusCode.OK;
    return this.lineService.lineSignUp(lineSignUpRequestDto);
  }

  /**
   * Check if a line member is connected with line OA account.
   **/
  @Get('member/check-oa-status/:lineId')
  async checkMemberLinkedToLineOA(@Param('lineId') lineId: string) {
    return await this.lineService.checkMemberLinkedToLineOA(lineId);
  }

  /**
   * Unbinds an existing line account form their member account.
   **/
  @Get('member/line-unbind')
  @UseGuards(ClientAuthGuard)
  async unbindLineAccount(@Req() request: CustomRequest) {
    const userId = request['user']?.sub;

    request.message = `Successfully removed line account for user with id: ${userId}`;

    return this.lineService.unbindLineAccount(userId);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.sendResetPasswordEmail(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Post('resend-forgot-password')
  async resendForgotPassword(@Body() body: { email: string }) {
    return this.authService.sendResetPasswordEmail(body.email);
  }
}
