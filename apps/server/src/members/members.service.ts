import * as bcrypt from 'bcrypt';
import { Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { CheckFor, CheckForEnum } from 'src/constants/enums';
import {
  CreateMemberRequestDto,
  GetMembersRequestDto,
  MemberResponseDto,
  MemberStatus,
  MemberType,
  OrderByType,
  ResWithPaginationDTO,
} from '@repo/shared';
import { CreateLineMember } from 'src/shared/types/auth';
import { UpdateMemberDTO } from './dto/update-member.dto';
import { plainToInstance } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /********************************************
   *              -- CLIENT --                *
   ********************************************/

  /**
   * Get Member by ID
   * @param id - id to search in the database.
   * @returns Member as a promise.
   **/

  // --- USER ID --
  async findMemberById(id: string): Promise<Member> {
    try {
      if (!id) {
        throw new CustomException(
          'user id is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log('Where Member Id:', id);

      const user = await this.membersRepository.findOne({ where: { id } });

      console.log('User:', user);

      if (!user) {
        console.log('No user, throwing error:', user);
        // throw new NotFoundException('No user was found with the id provided.');
        throw new CustomException(
          "Member doesn't exist.",
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
    } catch (err) {
      console.log('findMemberById err:', err);
      throw new CustomException(
        "Member doesn't exist.",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // --- LINE ID ---
  async findMemberByLineId(id: string): Promise<Member> {
    return this.membersRepository.findOne({
      where: { lineId: id },
    });
  }

  /**
   * Check if Member Exists by Email, throwing an error if they are not found.
   * @param email - Email to check in the database.
   * @param checkFor - Whether to check the user exists or does not exist.
   **/
  async checkMemberExistsByEmail(
    email: string,
    checkFor: CheckForEnum = CheckFor.EXISTS,
  ) {
    const exists = await this.membersRepository.findOne({
      where: { email },
    });

    if (checkFor === CheckFor.EXISTS && !exists) {
      throw new CustomException('帳號不存在', HttpStatus.BAD_REQUEST);
    }

    if (
      checkFor === CheckFor.NOT_EXISTS &&
      exists &&
      exists.type === MemberType.E &&
      exists.status === MemberStatus.ACTIVE
    ) {
      throw new CustomException('此帳號已註冊', HttpStatus.BAD_REQUEST);
    }

    if (
      checkFor === CheckFor.NOT_EXISTS &&
      exists &&
      exists.type === MemberType.E &&
      exists.status === MemberStatus.NOT_YET_VERIFIED
    ) {
      // send verification email
      await this.authService.sendVerificationEmail(exists);
      throw new CustomException(
        '此帳號未驗證但已被註冊',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      checkFor === CheckFor.NOT_EXISTS &&
      exists &&
      exists.type === MemberType.L
    ) {
      throw new CustomException('此帳號已綁定LINE登入', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find Member by Email. This version does not throw an error.
   * @param email - Email to search in the database.
   * @returns Member or undefined if not found.
   **/
  async findMemberByEmail(email: string): Promise<Member | undefined> {
    return this.membersRepository.findOne({ where: { email } });
  }

  /**
   * Creates a new email member via email sign up.
   **/
  async createEmailMember(memberEmailSignUpDto: CreateMemberRequestDto) {
    const { password, email } = memberEmailSignUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate a new member no
    const no = await this.generateNextMemberNo();

    const newMember = this.membersRepository.create({
      ...memberEmailSignUpDto,
      email: email.toLowerCase(), // Convert email to lowercase
      no, // new member number
      password: hashedPassword,
      type: MemberType.E, // mark that the registration is for email
      status: MemberStatus.NOT_YET_VERIFIED,
    });

    // save member to DB(not yet verified)
    await this.membersRepository.save(newMember);

    // send verification email
    await this.authService.sendVerificationEmail(newMember);

    return newMember;
  }

  /**
   * Updates an existing email member.
   **/
  async updateExistingMemberById(
    id: string,
    updateMember: UpdateMemberDTO,
  ): Promise<MemberResponseDto> {
    const member = await this.findMemberById(id);

    try {
      const { skiLevel, snowboardLevel, ...rest } = updateMember;

      const updatedMember = await this.membersRepository.save({
        ...member,
        ...rest,
        skis: skiLevel,
        snowboard: snowboardLevel,
      });

      console.log('updatedMember inside member service:', updatedMember);

      const updatedMemberDto = plainToInstance(
        MemberResponseDto,
        updatedMember,
      );

      return updatedMemberDto;
    } catch (err) {
      throw new CustomException(
        'Error when attempting to update member: ' + err,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Creates a new line member.
   **/
  async createLineMember({
    lineId,
    lineName,
    avatar,
    name,
    phone,
    birthday,
    email,
  }: CreateLineMember): Promise<MemberResponseDto> {
    // generate a new member no
    const no = await this.generateNextMemberNo();

    const newMember = this.membersRepository.create({
      no, // new member number
      lineId: lineId,
      lineName: lineName,
      name,
      avatar,
      birthday,
      phone,
      email,
      type: MemberType.L, // mark that the registration is for LINE
    });

    const savedMember = this.membersRepository.save(newMember);
    const memberResponseDto = plainToInstance(MemberResponseDto, savedMember);

    return memberResponseDto;
  }

  /********************************************
   *              -- ADMIN  --                *
   ********************************************/

  /**
   * Get all members for admin members table.
   **/
  async getMembers(
    requestDto: GetMembersRequestDto,
  ): Promise<ResWithPaginationDTO<MemberResponseDto[]>> {
    try {
      let {
        // default
        page,
        limit,
        // eslint-disable-next-line
        keyword,
        // eslint-disable-next-line
        sort = 'createdTime',
        // eslint-disable-next-line
        order = 'asc',

        // additional
        startUpdatedTime,
        endUpdatedTime,
        no,
        email,
        type,
        status,
        skiLevel,
        snowboardLevel,
      } = requestDto;

      // check page and limit, default to 1 and 10 if not present.
      page = isNaN(Number(page)) || page <= 0 ? 1 : Number(page);
      limit = isNaN(Number(limit)) || limit <= 0 ? 10 : Number(limit);

      const queryBuilder = this.membersRepository.createQueryBuilder('member');

      // --- filters ---

      // -- filter: by date --
      if (startUpdatedTime) {
        queryBuilder.andWhere('member.updatedTime >= :startUpdatedTime', {
          startUpdatedTime,
        });
      }
      if (endUpdatedTime) {
        queryBuilder.andWhere('member.updatedTime <= :endUpdatedTime', {
          endUpdatedTime,
        });
      }

      // -- filter: by member no --
      if (no) {
        queryBuilder.andWhere('member.no = :no', { no });
      }

      // -- filter: by email --
      if (email) {
        queryBuilder.andWhere('member.email LIKE :email', {
          email: `%${email}`,
        });
      }

      // -- fitler: by member's registration type --
      if (type) {
        queryBuilder.andWhere('member.type = :type', { type });
      }

      // -- filter: by member's snowboard level --
      const snowboardLevelArray = String(snowboardLevel)
        .split(',')
        .map((level) => Number(level))
        .filter((level) => !isNaN(level)); // Filter out invalid numbers

      if (snowboardLevelArray.length > 0) {
        queryBuilder.andWhere('member.snowboard IN (:...snowboardLevelArray)', {
          snowboardLevelArray,
        });
      }

      // -- filter: by member's ski level --
      const skiLevelArray = String(skiLevel)
        .split(',')
        .map((level) => Number(level))
        .filter((level) => !isNaN(level)); // Filter out invalid numbers

      if (skiLevelArray.length > 0) {
        queryBuilder.andWhere('member.skis IN (:...skiLevelArray)', {
          skiLevelArray,
        });
      }

      // -- filter: by status --
      const statusArray = String(status)
        .split(',')
        .map((level) => Number(level))
        .filter((level) => !isNaN(level)); // Filter out invalid numbers

      if (statusArray.length > 0) {
        queryBuilder.andWhere('member.status IN (:...statusArray)', {
          statusArray,
        });
      }

      // -- filter: by keyword search --
      if (keyword) {
        queryBuilder.andWhere(
          'member.name ILIKE :keyword OR member.phone LIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        );
      }

      // --- sorting ---
      const columnMap = {
        // default columns
        createdAt: 'created_time',
        updatedAt: 'updated_time',

        // entity-specific columns
        skiLevel: 'ski',
        snowboardLevel: 'snowboard',
      };

      const dbSortCol = columnMap[sort] || sort;

      queryBuilder.orderBy(`member.${dbSortCol}`, OrderByType[order]);

      // --- pagination ---
      queryBuilder.skip((page - 1) * limit).take(limit);

      // run query
      const [members, total] = await queryBuilder.getManyAndCount();

      // convert to DTO
      const memberDtos = plainToInstance(MemberResponseDto, members);

      // get total pages
      const pages = Math.ceil(total / limit);

      console.log('members data from DB:', members);

      return {
        data: memberDtos,
        total,
        page,
        limit,
        pages,
      };
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new CustomException(
        `Error when attempting to query data with provided parameters: ${err}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Gets a single member's detail data via ID from query param.
   **/
  async getMemberDetailsById(id: string): Promise<MemberResponseDto> {
    const member = await this.findMemberById(id);
    // console.log('member:', member);
    const memberDto = plainToInstance(MemberResponseDto, member);
    memberDto.lineName = member.lineName;
    memberDto.lineId = member.lineId;
    // console.log('memberDto:', memberDto);

    return memberDto;
  }

  /**
   * Toggles a member's status.
   * Active (1) / Inactive (0)
   **/
  async toggleMemberStatus(id: string): Promise<MemberResponseDto> {
    const member = await this.findMemberById(id);

    member.status =
      member.status === MemberStatus.ACTIVE
        ? MemberStatus.INACTIVE
        : MemberStatus.ACTIVE;

    const updatedMember = await this.membersRepository.save(member);

    return plainToInstance(MemberResponseDto, updatedMember);
  }

  /**
   * Deactivates member system access by Id, toggling their status to "INACTIVE".
   **/
  async deactivateMember(id: string): Promise<MemberResponseDto> {
    // find and verify member exists
    const member = await this.findMemberById(id);
    member.status = MemberStatus.INACTIVE;

    const updatedMember = this.membersRepository.save(member);

    const updatedMemberDto = plainToInstance(MemberResponseDto, updatedMember);
    return updatedMemberDto;
  }

  /**
   * Activates a member's system access by Id, toggling their status to "ACTIVE".
   **/
  async activateMember(id: string): Promise<MemberResponseDto> {
    // find and verify member exists
    const member = await this.findMemberById(id);
    member.status = MemberStatus.ACTIVE;

    const updatedMember = this.membersRepository.save(member);

    const updatedMemberDto = plainToInstance(MemberResponseDto, updatedMember);
    return updatedMemberDto;
  }

  /********************************************
   *           -- HELPER FNS --               *
   ********************************************/

  private async generateNextMemberNo(): Promise<string> {
    const lastMember = await this.membersRepository.find({
      order: { no: 'DESC' },
      take: 1,
    });

    const nextNo = lastMember.length ? parseInt(lastMember[0].no, 10) + 1 : 1;

    // adding 0s in front of number until 8 digits
    return nextNo.toString().padStart(8, '0');
  }

  // --- EXAMPLE ---

  /**
   * Get all members for admin members table.
   **/
  async getTableDataExample(
    requestDto: GetMembersRequestDto,
  ): Promise<ResWithPaginationDTO<MemberResponseDto[]>> {
    try {
      let {
        // default
        page,
        limit,
        keyword,
        sort = 'createdTime',
        order = 'asc',

        // additional
        startUpdatedTime,
        endUpdatedTime,
        status, // for multi-select example
      } = requestDto;

      // check page and limit, default to 1 and 10 if not present.
      page = isNaN(Number(page)) || page <= 0 ? 1 : Number(page);
      limit = isNaN(Number(limit)) || limit <= 0 ? 10 : Number(limit);

      const queryBuilder = this.membersRepository.createQueryBuilder('member');

      // --- filters ---

      // -- filter: by date --
      if (startUpdatedTime) {
        queryBuilder.andWhere('member.updatedTime >= :startUpdatedTime', {
          startUpdatedTime,
        });
      }
      if (endUpdatedTime) {
        queryBuilder.andWhere('member.updatedTime <= :endUpdatedTime', {
          endUpdatedTime,
        });
      }

      // -- filter: by keyword search --
      if (keyword) {
        queryBuilder.andWhere(
          'member.name ILIKE :keyword OR member.phone LIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        );
      }

      // -- filter: (Multi-Option Example) by status --
      const statusArray = String(status)
        .split(',')
        .map((level) => Number(level))
        .filter((level) => !isNaN(level)); // Filter out invalid numbers

      if (statusArray.length > 0) {
        queryBuilder.andWhere('member.status IN (:...status)', { status });
      }

      // --- sorting ---

      const columnMap = {
        // default columns
        createdAt: 'created_time',
        updatedAt: 'updated_time',

        // entity-specific columns
        skiLevel: 'ski',
      };

      const dbSortCol = columnMap[sort] || sort;

      queryBuilder.orderBy(`member.${dbSortCol}`, OrderByType[order]);

      // --- pagination ---
      queryBuilder.skip((page - 1) * limit).take(limit);

      // run query
      const [members, total] = await queryBuilder.getManyAndCount();

      // Convert to DTO Response Type
      // use
      // {
      //  excludeExtraneousValues: true,
      // }
      // to filter out properities that do not have @Expose
      // not needed if you use @Exclude on properties you DO NOT want to show
      const memberDtos = plainToInstance(MemberResponseDto, members);

      // get total pages
      const pages = Math.ceil(total / limit);

      return {
        data: memberDtos,
        total,
        page,
        limit,
        pages,
      };
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new CustomException(
        `Error when attempting to query data with provided parameters: ${err}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const member = await this.membersRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('找不到使用者');
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, member.password);
    if (!isValidPassword) {
      throw new BadRequestException('舊密碼不正確');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.membersRepository.update(id, {
      password: hashedPassword,
      updatedTime: new Date(),
    });

    return {
      success: true,
      message: '密碼更新成功',
    };
  }
}
