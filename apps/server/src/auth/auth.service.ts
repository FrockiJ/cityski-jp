import * as bcrypt from 'bcrypt';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  CreateMemberRequestDto,
  Department,
  DepartmentStatus,
  GetPermissionRequestDTO,
  GetPermissionResponseDTO,
  MemberSignInDTO,
  MemberSignInResponseDTO,
  MemberStatus,
  MenuDTO,
  RefreshTokenResponseDTO,
  SignInRequestDTO,
  UpdatePasswordByForgotRequestDTO,
  UserStatus,
  ForgotRequestDTO,
  JwtUserTypeEnum,
  JwtUserType,
  GetUsersResponseDTO,
  MemberResponseDto,
  MemberType,
} from '@repo/shared';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import { SignInResponseDTO } from '@repo/shared';
import { UsersService } from 'src/users/users.service';
import { CustomException } from 'src/common/exception/custom.exception';
import { UpdatePasswordRequestDTO, UserIsDefPassword } from '@repo/shared';
import { Menu } from 'src/menu/entities/menu.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UserRolesDepartments } from 'src/users/entities/userRolesDepartments.entity';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { CheckFor } from 'src/constants/enums';
import { JwtSignPayload } from 'src/shared/types/auth';
import { plainToInstance } from 'class-transformer';
import { SMTPService } from 'src/smtp/smtp.service';

@Injectable()
export class AuthService {
  constructor(
    // repository injection
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Menu) private menusRepo: Repository<Menu>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(UserRolesDepartments)
    private urdRepo: Repository<UserRolesDepartments>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    private readonly membersService: MembersService,
    private readonly usersService: UsersService,
    // jwt service injection
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly smtpService: SMTPService,
  ) {}

  private resetTempTokens = [];

  ACCESS_EXPIRE_IN: StringValue = '30m';
  REFRESH_EXPIRE_IN: StringValue = '7d';

  FORGOT_PASSWORD_ACCESS_EXPIRE_IN: StringValue = '10m';

  /********************************************
   *           -- ADMIN USER --               *
   ********************************************/

  // authenticate user signin and provide user info
  async signIn({
    email,
    password,
  }: SignInRequestDTO): Promise<SignInResponseDTO> {
    // check if user even exists before authenticating
    const user = await this.usersService._getUserByEmailForSignIn(email);

    // verify account status
    await this.verifyUserStatus(user);

    // check if password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('密碼錯誤');
    }

    // if successful, generate jwt token and return user
    const { accessToken, refreshToken } = await this.generateJwtToken(
      user,
      JwtUserType.USER,
    );

    // get department
    const urds = await this.urdRepo
      .createQueryBuilder('urd')
      .leftJoinAndSelect('urd.department', 'department') // 关联 department 表
      .where('urd.user = :userId', { userId: user.id })
      .andWhere('department.status = :departmentStatus', {
        departmentStatus: DepartmentStatus.ACTIVE,
      })
      .orderBy('department.sequence', 'ASC') // 根据 department.sequence 排序
      .getMany();

    const departments = urds.map((urd) => ({
      id: urd.department.id,
      name: urd.department.name,
      address: urd.department.address,
      phone: urd.department.phone,
      status: urd.department.status,
    }));

    const savedUser = this.usersRepo.create({
      ...user,
      refresh: refreshToken,
    });
    await this.usersRepo.save(savedUser);

    return {
      accessToken,
      refreshToken,
      expiresIn: ms(this.ACCESS_EXPIRE_IN),
      refreshExpiresIn: ms(this.REFRESH_EXPIRE_IN),
      departments,
    };
  }

  // sign out
  async signOut(userId: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: userId } });
      const savedUser = this.usersRepo.create({
        ...user,
        refresh: null,
      });
      await this.usersRepo.save(savedUser);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Verify token validity
  async checkResetToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      // throw error if user can't be saved
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // change password
  async updatePassword(userData: UpdatePasswordRequestDTO, userId: string) {
    const { oldPassword, newPassword, repeatNewPassword } = userData;
    try {
      const user = await this.usersService.getUserById(userId);
      if (!user) {
        throw new CustomException('查無使用者', HttpStatus.NOT_FOUND);
      }
      if (!oldPassword && user.isDefPassword === UserIsDefPassword.NO) {
        throw new CustomException('目前密碼為必填', HttpStatus.BAD_REQUEST);
      }
      if (oldPassword && user.isDefPassword === UserIsDefPassword.NO) {
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
          throw new CustomException('目前密碼錯誤', HttpStatus.BAD_REQUEST);
        }
      }
      if (oldPassword === newPassword) {
        throw new CustomException('新舊密碼不可相同', HttpStatus.BAD_REQUEST);
      }
      if (newPassword !== repeatNewPassword) {
        throw new CustomException('新密碼驗證錯誤', HttpStatus.BAD_REQUEST);
      }

      const salt = 10;
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const updateUser = this.usersRepo.create({
        ...user,
        password: hashedPassword,
        isDefPassword: UserIsDefPassword.NO,
      });

      await this.usersRepo.save(updateUser);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      // throw error if user can't be saved
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // forgot reset password
  async updatePasswordByForgot(userData: UpdatePasswordByForgotRequestDTO) {
    const { newPassword, repeatNewPassword, token } = userData;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const resetTokens = this.getResetTokens();
      if (!resetTokens.includes(token)) {
        throw new CustomException(
          '此連結已經失效，請點擊「重新寄送連結」，進行重新設定密碼',
          HttpStatus.NOT_FOUND,
        );
      }

      const user = await this.usersService.getUserById(payload.sub);
      if (!user) {
        throw new CustomException('查無使用者', HttpStatus.NOT_FOUND);
      }
      if (newPassword !== repeatNewPassword) {
        throw new CustomException('新密碼驗證錯誤', HttpStatus.BAD_REQUEST);
      }

      const salt = 10;
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const updateUser = this.usersRepo.create({
        ...new User(),
        ...user,
        password: hashedPassword,
        isDefPassword: UserIsDefPassword.NO,
      });

      await this.usersRepo.save(updateUser);
      this.clearResetTempToken(token);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      // throw error if user can't be saved
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // NOTE: Add UserId that comes from token
  async getUserPermissionMenus(
    data: GetPermissionRequestDTO,
    userId: string,
  ): Promise<GetPermissionResponseDTO> {
    try {
      const { departmentId } = data;

      const user = await this.usersService.getUserById(userId);

      const superAdmin = await this.usersService.getSuperAdmin();

      const urds = await this.urdRepo.find({
        where: { user: { id: userId } },
        relations: ['role', 'department'],
      });

      const targetUrd = urds.find((urd) => urd.department.id === departmentId);
      if (!targetUrd || !targetUrd?.role) {
        throw new CustomException(
          'departmentId找不到對應資料',
          HttpStatus.BAD_REQUEST,
        );
      }

      const subQuery = this.rolesRepo
        .createQueryBuilder('role')
        .innerJoin('role.menus', 'menu')
        .innerJoin('menu.subPages', 'subPage')
        .innerJoin('subPage.roles', 'subPageRole')
        .where('subPageRole.id = :subPageRoleId', {
          subPageRoleId: targetUrd?.role?.id,
        })
        .select('subPageRole.id');

      const roleWithMenus = await this.rolesRepo
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.menus', 'menu')
        .leftJoinAndSelect('menu.subPages', 'subPage')
        .leftJoin('subPage.roles', 'subPageRole')
        .where('role.id = :id', { id: targetUrd?.role?.id })
        .andWhere('menu.parent IS NULL')
        .andWhere(
          `(subPageRole.id IS NULL OR subPageRole.id IN (${subQuery.getQuery()}))`,
        )
        .setParameters(subQuery.getParameters())
        .orderBy('menu.sequence', 'ASC')
        .addOrderBy('subPage.sequence', 'ASC')
        .getOne();

      const formattedMenus: MenuDTO[] = roleWithMenus.menus.map((menu) => {
        return {
          id: menu.id,
          groupName: menu.groupName,
          name: menu.name,
          path: menu.path,
          sequence: menu.sequence,
          status: menu.status,
          icon: menu.icon,
          subPages: menu.subPages,
        };
      });

      const formattedDepartments: Department[] = urds.map((urd) => {
        return {
          id: urd.department.id,
          name: urd.department.name,
          address: urd.department.address,
          phone: urd.department.phone,
          status: urd.department.status,
        };
      });

      delete targetUrd.role.createdTime;
      delete targetUrd.role.updatedTime;
      delete targetUrd.department.createdTime;
      delete targetUrd.department.updatedTime;
      delete targetUrd.department.sequence;

      delete user.password;

      const res = {
        userInfo: {
          userPermissionId: targetUrd.id,
          id: user.id,
          name: user.name,
          email: user.email,
          isDefPassword: user.isDefPassword,
          status: user.status,
          isSuperAdmin: superAdmin.id === user.id,
          userRolesDepartments: targetUrd,
        },
        menus: formattedMenus,
        departments: formattedDepartments,
      };

      return res;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get token info
  async getTokenInfo(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.decode(token);
      return payload;
    } catch (err) {
      throw new CustomException(err, HttpStatus.BAD_REQUEST);
    }
  }

  // generate jwt token
  async generateJwtToken(
    user: any,
    userType: JwtUserTypeEnum,
    isForgotPassword?: boolean,
  ) {
    // construct jwt payload

    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      userType,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          expiresIn: isForgotPassword
            ? this.FORGOT_PASSWORD_ACCESS_EXPIRE_IN
            : this.ACCESS_EXPIRE_IN,
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        },
      ),

      this.jwtService.signAsync(
        { ...payload },
        {
          expiresIn: this.REFRESH_EXPIRE_IN,
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Attempts to provide new access token with an existing, non-expired refresh token.
   **/
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponseDTO> {
    try {
      // verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // extract the user details from the payload
      const userId = payload.sub;
      const username = payload.username;
      const userType = payload.userType;

      console.log('userType:', userType);

      let user: User | Member;

      const jwtSignPayload: JwtSignPayload = {
        sub: userId,
        username,
        userType,
      };

      // generate new access token
      const accessToken = await this.jwtService.signAsync(jwtSignPayload, {
        expiresIn: this.ACCESS_EXPIRE_IN,
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      // rotating refresh token
      const newRefreshToken = await this.jwtService.signAsync(jwtSignPayload, {
        expiresIn: this.REFRESH_EXPIRE_IN,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      let userResponse: GetUsersResponseDTO | MemberResponseDto;

      if (userType === JwtUserType.USER) {
        const user = await this.usersService.getUserById(userId);
        if (!user) {
          throw new CustomException(
            'Refresh Token Invalid',
            HttpStatus.BAD_REQUEST,
          );
        }

        const savedUser = this.usersRepo.create({
          ...user,
          refresh: newRefreshToken,
        });
        await this.usersRepo.save(savedUser);

        // convert type to fit user response
        userResponse = plainToInstance(GetUsersResponseDTO, user);
      } else if (userType === JwtUserType.MEMBER) {
        user = await this.membersService.findMemberById(userId);
        if (!user) {
          throw new CustomException(
            'Refresh Token Invalid',
            HttpStatus.BAD_REQUEST,
          );
        }

        const savedMember = this.membersRepository.create({
          ...user,
          refresh: newRefreshToken,
        });
        await this.membersRepository.save(savedMember);
        userResponse = plainToInstance(MemberResponseDto, user);
      }

      return {
        accessToken,
        refreshToken: newRefreshToken,
        userInfo: userResponse,
        expiresIn: ms(this.ACCESS_EXPIRE_IN),
        refreshExpiresIn: ms(this.REFRESH_EXPIRE_IN),
      };
    } catch (error) {
      console.error(error);

      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // get temp tokens
  getResetTokens() {
    return this.resetTempTokens;
  }

  // set temp tokens
  setResetTokens(tokens: string[]) {
    this.resetTempTokens = tokens;
  }

  // delete temp token
  async clearResetTempToken(token: string) {
    try {
      const tokens = this.getResetTokens().filter(
        (resetToken) => resetToken !== token,
      );
      this.setResetTokens(tokens);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // send email
  async forgotAdminPassword(requestData: ForgotRequestDTO) {
    const { email, token } = requestData;
    try {
      let userEmail = email;
      if (!email && token) {
        const payload = await this.getTokenInfo(token);
        userEmail = payload.email;
      }
      const user = userEmail
        ? await this.usersService.getUserByEmail(userEmail)
        : null;

      if (!user) {
        throw new CustomException('帳號不存在', HttpStatus.BAD_REQUEST);
      }
      if (user.status !== UserStatus.ACTIVE) {
        throw new CustomException(
          '此帳號目前為非啟用狀態',
          HttpStatus.BAD_REQUEST,
        );
      }

      // generate token
      const { accessToken } = await this.generateJwtToken(
        user,
        JwtUserType.USER,
        true,
      );

      this.resetTimer(accessToken);

      // Create reset URL with the token
      const resetUrl = `${this.configService.get('CLIENT_ADMIN_DOMAIN')}/reset-password?token=${accessToken}`;

      // Send reset password email using the admin-specific method
      await this.smtpService.sendAdminResetPasswordEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });

      return {
        message: '重設密碼連結寄送成功',
        statusCode: HttpStatus.CREATED,
      };
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(
        '重設密碼連結寄送失敗',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // token timer, 10 mins
  private async resetTimer(token: string) {
    try {
      const tokens = this.getResetTokens();
      if (!tokens.includes(token)) {
        this.setResetTokens([...tokens, token]);

        setTimeout(() => {
          const currentTokens = this.getResetTokens();
          const newTokens = currentTokens.filter(
            (currentToken) => currentToken !== token,
          );
          this.setResetTokens(newTokens);
        }, 600000);
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /********************************************
   *        -- MEMBER (CLIENT USER) --        *
   ********************************************/

  /**
   * Standard Email Registration for Members
   **/
  async memberEmailSignUp(
    memberEmailSignUpDto: CreateMemberRequestDto,
  ): Promise<Member> {
    const { email } = memberEmailSignUpDto;

    // confirm user is not already registered
    await this.membersService.checkMemberExistsByEmail(
      email,
      CheckFor.NOT_EXISTS,
    );

    // create member and return them
    const newMember =
      await this.membersService.createEmailMember(memberEmailSignUpDto);

    return newMember;
  }

  /**
   * Sign-in for Members via Email.
   **/
  async memberEmailSignIn(
    MemberSignInDTO: MemberSignInDTO,
  ): Promise<MemberSignInResponseDTO> {
    const { email, password } = MemberSignInDTO;

    // check if member exists
    const member = await this.membersService.findMemberByEmail(email);

    if (!member) {
      throw new CustomException(
        '錯誤帳號或密碼，請重新確認',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (member.type === MemberType.L) {
      throw new CustomException(
        '此帳號非Email註冊，請使用Line登入',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (member.status === MemberStatus.NOT_YET_VERIFIED) {
      await this.sendVerificationEmail(member);
      throw new CustomException(
        '此帳號已註冊但尚未驗證',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (member.status === MemberStatus.INACTIVE) {
      throw new CustomException('此帳號已停用', HttpStatus.BAD_REQUEST);
    }

    // validate password
    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      throw new CustomException(
        '錯誤帳號或密碼，請重新確認',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // if successful, generate jwt token and return user
    const { accessToken, refreshToken } = await this.generateJwtToken(
      member,
      JwtUserType.MEMBER,
    );

    delete member.password;

    return {
      userInfo: member,
      accessToken,
      refreshToken,
      expiresIn: ms(this.ACCESS_EXPIRE_IN),
      refreshExpiresIn: ms(this.REFRESH_EXPIRE_IN),
    };
  }

  /********************************************
   *           -- OTHER HELPERS  --           *
   ********************************************/

  async verifyUserStatus(user: User) {
    if (user.status === UserStatus.INACTIVE) {
      throw new CustomException(
        'User account is de-activated.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.status === UserStatus.DELETE) {
      throw new CustomException(
        'User account is already deleted.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyMemberStatus(member: Member) {
    if (member.status === UserStatus.INACTIVE) {
      throw new CustomException(
        'Member account is de-activated.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (member.status === MemberStatus.NOT_YET_VERIFIED) {
      throw new CustomException(
        'Member account is not yet verified.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendVerificationEmail(member: Member) {
    try {
      // Generate verification token
      const verificationToken = await this.jwtService.signAsync(
        {
          id: member.id,
          email: member.email,
          type: 'email_verification',
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '24h',
        },
      );

      // Create verification URL with the token
      const verificationUrl = `${this.configService.get('CLIENT_DOMAIN')}/verify-account?token=${verificationToken}`;

      // Send verification email using SMTP service
      await this.smtpService.sendVerificationEmail({
        to: member.email,
        name: member.name,
        verificationUrl,
      });

      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new CustomException(
        'Failed to send verification email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Add verification endpoint
  async verifyEmail(token: string) {
    try {
      // Verify token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      if (payload.type !== 'email_verification') {
        throw new CustomException('Invalid token type', HttpStatus.BAD_REQUEST);
      }

      // Find member
      const member = await this.membersRepository.findOne({
        where: { id: payload.id },
      });

      if (!member) {
        throw new CustomException('無此帳號', HttpStatus.NOT_FOUND);
      }

      if (member.status === MemberStatus.ACTIVE) {
        throw new CustomException(
          'Email already verified',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Update member status to active
      member.status = MemberStatus.ACTIVE;
      await this.membersRepository.save(member);

      // Generate login tokens
      const { accessToken, refreshToken } = await this.generateJwtToken(
        member,
        JwtUserType.MEMBER,
      );

      return {
        accessToken,
        refreshToken,
        userInfo: member,
        expiresIn: ms(this.ACCESS_EXPIRE_IN),
        refreshExpiresIn: ms(this.REFRESH_EXPIRE_IN),
      };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException(
        'Invalid or expired verification token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      // Find the member
      const member = await this.membersRepository.findOne({
        where: { email },
      });

      if (!member) {
        throw new CustomException('無此帳號', HttpStatus.NOT_FOUND);
      }

      if (member.status === MemberStatus.ACTIVE) {
        throw new CustomException(
          'Email already verified',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Send verification email
      await this.sendVerificationEmail(member);

      return { message: 'Verification email resent successfully' };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException(
        'Failed to resend verification email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendResetPasswordEmail(email: string) {
    try {
      const member = await this.membersRepository.findOne({
        where: { email: email.toLowerCase() },
      });

      if (!member) {
        throw new CustomException('無此帳號', HttpStatus.NOT_FOUND);
      }

      if (member.type === MemberType.L) {
        throw new CustomException(
          '此帳號非Email註冊，請使用Line登入',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Generate reset token
      const resetToken = await this.jwtService.signAsync(
        {
          id: member.id,
          email: member.email,
          type: 'password_reset',
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      );

      // Send reset password email
      await this.smtpService.sendResetPasswordEmail({
        to: member.email,
        name: member.name,
        resetUrl: `${this.configService.get('CLIENT_DOMAIN')}/reset-password?token=${resetToken}`,
      });

      return {
        message: '重設密碼連結寄送成功',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException(
        '重設密碼連結寄送失敗',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verify token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      if (payload.type !== 'password_reset') {
        throw new CustomException('重設密碼連結失效', HttpStatus.BAD_REQUEST);
      }

      // Find member
      const member = await this.membersRepository.findOne({
        where: { id: payload.id },
      });

      // if (member.type === MemberType.L) {
      //   throw new CustomException(
      //     '此帳號非Email註冊，無法重設密碼',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      if (!member) {
        throw new CustomException('無此帳號', HttpStatus.NOT_FOUND);
      }

      // for testing
      // throw new CustomException('test fail', HttpStatus.BAD_GATEWAY);

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      member.password = hashedPassword;
      await this.membersRepository.save(member);

      return { message: '重設密碼成功' };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException(
        `Failed to reset password`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
