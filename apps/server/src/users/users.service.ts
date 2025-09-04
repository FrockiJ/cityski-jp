import * as bcrypt from 'bcrypt';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  CreateUserRequestDTO,
  DepartmentStatus,
  GetRoleOptionsResponseDTO,
  GetUserByEmailResponseDTO,
  GetUsersRequestDTO,
  GetUsersResponseDTO,
  IsSuperAdmin,
  OrderType,
  ResWithPaginationDTO,
  UpdateUserRequestDTO,
  UserIsDefPassword,
  UserStatus,
} from '@repo/shared';
import { UserRolesDepartments } from './entities/userRolesDepartments.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Department } from 'src/departments/entities/department.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { plainToInstance } from 'class-transformer';
import { SMTPService } from 'src/smtp/smtp.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(UserRolesDepartments)
    private urdRepo: Repository<UserRolesDepartments>,
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
    @InjectRepository(Department)
    private departmentsRepo: Repository<Department>,
    private smtpService: SMTPService,
    private readonly configService: ConfigService,
  ) {}

  // after menu and role are created, execute from menuService
  async initialize() {
    try {
      const superAdmin = await this.getSuperAdmin();

      const superAdminRole = await this.rolesRepo.findOne({
        where: { superAdm: IsSuperAdmin.YES },
      });
      const departments = await this.departmentsRepo.find();

      if (!superAdmin && superAdminRole && departments) {
        await this.createUser(
          {
            name: '孫弘昆',
            email: 'systemadmin@example.com',
            password: 'Systemadmin@123',
            isDefPassword: UserIsDefPassword.NO,
            departmentsWithRoles: departments.map((department) => ({
              departmentId: department.id,
              roleId: superAdminRole.id,
            })),
          },
          null,
        );
      }
    } catch (error) {
      console.log('user error', error);
    }
  }

  async getSuperAdmin() {
    const superAdmin = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRolesDepartments', 'urd')
      .leftJoinAndSelect('urd.role', 'role')
      .where('role.superAdm = 1')
      .getOne();
    return superAdmin;
  }

  // validates a user exists without email
  async userExists(email: string): Promise<boolean> {
    try {
      const user = await this.usersRepo.findOne({ where: { email } });

      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      throw new HttpException('User with this email does not exist.', 400);
    }
  }

  // using from login only
  async _getUserByEmailForSignIn(email: string): Promise<User> {
    try {
      const user = await this.usersRepo.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(
          'No user was found with the email provided.',
        );
      }
      return user;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // gets a single user by email
  async getUserByEmail(email: string): Promise<GetUserByEmailResponseDTO> {
    try {
      const user = await this.usersRepo.findOne({ where: { email } });
      console.log('user', user, email);
      if (!user) {
        throw new NotFoundException(
          'No user was found with the email provided.',
        );
      }

      const res = plainToInstance(GetUserByEmailResponseDTO, user, {
        excludeExtraneousValues: true,
      });
      return res;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // gets a single user with email
  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.usersRepo.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('No user was found with the id provided.');
      }
      return user;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // gets list of all users
  async getUsers(
    getUsersRequestDTO: GetUsersRequestDTO,
  ): Promise<ResWithPaginationDTO<GetUsersResponseDTO[]>> {
    try {
      const superAdmin = await this.getSuperAdmin();
      const formatPage = getUsersRequestDTO.page || 1;
      let formatLimit = 0;
      if (!getUsersRequestDTO.limit) {
        formatLimit = await this.usersRepo.count();
      } else {
        formatLimit = getUsersRequestDTO.limit;
      }
      // const users = await this.usersRepo.find();
      const queryBuilder = this.usersRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userRolesDepartments', 'userRolesDepartments')
        .leftJoinAndSelect('userRolesDepartments.role', 'role')
        .leftJoinAndSelect('userRolesDepartments.department', 'department')
        .select([
          'user.updatedTime',
          'user.id',
          'user.name',
          'user.email',
          'user.status',
          'user.isDefPassword',
          'userRolesDepartments.id',
          'role.id',
          'role.name',
          'role.superAdm',
          'role.status',
          'department.id',
          'department.name',
          'department.address',
          'department.phone',
          'department.status',
        ]);

      if (getUsersRequestDTO.sort === 'roles') {
        queryBuilder.orderBy(
          'role.name',
          getUsersRequestDTO.order
            ? getUsersRequestDTO.order.toLocaleLowerCase() === OrderType.ASC
              ? 'ASC'
              : 'DESC'
            : 'DESC',
        );
      } else {
        queryBuilder.orderBy(
          getUsersRequestDTO.sort
            ? `user.${getUsersRequestDTO.sort}`
            : 'user.updatedTime',
          getUsersRequestDTO.order
            ? getUsersRequestDTO.order.toLocaleLowerCase() === OrderType.ASC
              ? 'ASC'
              : 'DESC'
            : 'DESC',
        );
      }

      // always filter delete user
      queryBuilder.andWhere('user.status != :deleteStatus', {
        deleteStatus: UserStatus.DELETE,
      });

      // filter role only
      if (getUsersRequestDTO.roles) {
        queryBuilder.andWhere('role.id IN (:...roleIds)', {
          roleIds: getUsersRequestDTO.roles.split(','),
        });
      }

      // filter updatedTime
      if (
        getUsersRequestDTO.startUpdatedTime &&
        getUsersRequestDTO.endUpdatedTime
      ) {
        queryBuilder.andWhere(
          'DATE(role.updatedTime) >= :startUpdatedTime AND DATE(role.updatedTime) <= :endUpdatedTime',
          {
            startUpdatedTime: new Date(getUsersRequestDTO.startUpdatedTime),
            endUpdatedTime: new Date(getUsersRequestDTO.endUpdatedTime),
          },
        );
      }
      // filter search
      if (getUsersRequestDTO.keyword) {
        queryBuilder.andWhere(
          'user.name ILIKE :keyword OR user.email ILIKE :keyword',
          {
            keyword: `%${getUsersRequestDTO.keyword}%`,
          },
        );
      }
      const total = await queryBuilder.getCount();

      const users = await queryBuilder
        .skip((formatPage - 1) * formatLimit)
        .take(formatLimit)
        .getMany();

      const limit = formatLimit; // per count
      const page = formatPage; // current page

      const formattedUsers = users.map((user) => {
        return {
          ...user,
          isSuperAdmin: user.id === superAdmin.id,
        };
      });

      const res: ResWithPaginationDTO<GetUsersResponseDTO[]> = {
        data: formattedUsers,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };

      return res;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async createUser(createUserDTO: CreateUserRequestDTO, userId: string | null) {
    const { departmentsWithRoles, isDefPassword, ...otherCreateUserDTO } =
      createUserDTO;
    const defaultPassword = 'Password@123';
    try {
      if (departmentsWithRoles.length === 0) {
        throw new CustomException('至少需選擇一組角色', HttpStatus.BAD_REQUEST);
      }
      // hash password before saving
      const salt = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDTO.password || defaultPassword,
        salt,
      );
      // find if user exists already to prevent duplicate users
      const isUserExist = await this.userExists(createUserDTO.email);

      if (isUserExist) {
        throw new CustomException('此帳號已有人使用', HttpStatus.BAD_REQUEST);
      }

      const userRolesDepartments = await Promise.all(
        departmentsWithRoles.map(async ({ departmentId, roleId }) => {
          const department = await this.departmentsRepo.findOne({
            where: { id: departmentId },
          });
          const role = await this.rolesRepo.findOne({ where: { id: roleId } });

          // 確保department和role存在
          if (!role) {
            throw new CustomException(
              `roleId: ${roleId} 不存在`,
              HttpStatus.BAD_REQUEST,
            );
          }
          if (!department) {
            throw new CustomException(
              `departmentId: ${departmentId} 不存在`,
              HttpStatus.BAD_REQUEST,
            );
          }
          await this.smtpService.sendEmailForCreateUser(
            createUserDTO.email,
            `${this.configService.get('CLIENT_ADMIN_DOMAIN')}/login`,
          );
          return {
            role,
            department,
          };
        }),
      );

      // create user instance
      const user = this.usersRepo.create({
        ...new User(),
        ...otherCreateUserDTO,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
        isDefPassword: isDefPassword || UserIsDefPassword.YES,
        createdUser: userId,
        updatedUser: userId,
        userRolesDepartments, // using cascade
      });

      // create user
      await this.usersRepo.save(user);

      // return;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      // throw error if user can't be saved
      // throw new HttpException(err.message, 500);
      console.log(err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(updateUserData: UpdateUserRequestDTO, userId: string) {
    try {
      const user = await this.getUserById(updateUserData.id);
      const superAdmin = await this.getSuperAdmin();
      if (!user) {
        throw new CustomException('此id無對應角色', HttpStatus.BAD_REQUEST);
      }
      if (user.status === UserStatus.DELETE) {
        throw new CustomException('此帳號為已刪除人員', HttpStatus.BAD_REQUEST);
      }
      const isUserUsing = await this.urdRepo.findOne({
        where: { role: { id: updateUserData.id } },
      });

      if (
        !!isUserUsing &&
        user.status === UserStatus.ACTIVE &&
        updateUserData.status === UserStatus.INACTIVE
      ) {
        throw new CustomException('請先移除後台人員', HttpStatus.BAD_REQUEST);
      }
      let userRolesDepartments = [];
      if (user.id !== superAdmin.id) {
        userRolesDepartments = await Promise.all(
          updateUserData.departmentsWithRoles.map(
            async ({ departmentId, roleId }) => {
              const department = await this.departmentsRepo.findOne({
                where: { id: departmentId },
              });
              const role = await this.rolesRepo.findOne({
                where: { id: roleId },
              });

              // 確保department和role存在
              if (!role) {
                throw new CustomException(
                  `roleId: ${roleId} 不存在`,
                  HttpStatus.BAD_REQUEST,
                );
              }
              if (!department) {
                throw new CustomException(
                  `departmentId: ${departmentId} 不存在`,
                  HttpStatus.BAD_REQUEST,
                );
              }
              return {
                role,
                department,
              };
            },
          ),
        );
      }

      // superAdmin can only edit name
      if (user.id !== superAdmin.id) {
        // using cascade will auto replace all data
        // but we use @Unique(['user', 'department']) in urd entity, and it will conflict, so delete by self
        await this.urdRepo.delete({ user: user });
      }

      const savedUser = this.usersRepo.create({
        ...user,
        name: updateUserData.name,
        updatedUser: userId,
        updatedTime: new Date(),
        // superAdmin can only edit name
        ...(user.id !== superAdmin.id && { status: updateUserData.status }),
        ...(user.id !== superAdmin.id && { userRolesDepartments }), // using cascade
      });

      await this.usersRepo.save(savedUser);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // delete user
  async deleteUser(id: string, userId: string) {
    try {
      const user = await this.getUserById(id);
      const superAdmin = await this.getSuperAdmin();
      if (!user) {
        throw new CustomException('此id無對應角色', HttpStatus.BAD_REQUEST);
      }
      if (user.status === UserStatus.DELETE) {
        throw new CustomException('此帳號為已刪除人員', HttpStatus.BAD_REQUEST);
      }
      if (user.id === superAdmin.id) {
        throw new CustomException('無法操作系統管理員', HttpStatus.BAD_REQUEST);
      }
      const savedUser = this.usersRepo.create({
        ...user,
        status: UserStatus.DELETE,
        updatedUser: userId,
        updatedTime: new Date(),
      });
      await this.usersRepo.save(savedUser);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async userStatus(id: string) {
    try {
      const user = await this.getUserById(id);
      const superAdmin = await this.getSuperAdmin();
      if (!user) {
        throw new CustomException('此id無對應角色', HttpStatus.BAD_REQUEST);
      }
      if (user.id === superAdmin.id) {
        throw new CustomException('無法操作系統管理員', HttpStatus.BAD_REQUEST);
      }

      Object.assign(user, {
        ...user,
        status:
          user.status === UserStatus.INACTIVE
            ? UserStatus.ACTIVE
            : UserStatus.INACTIVE,
      });
      // update role
      await this.usersRepo.save(user);
      // return;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async roleOptions(): Promise<GetRoleOptionsResponseDTO> {
    try {
      // const departments = await this.departmentsRepo.find({
      //   where: { status: DepartmentStatus.ACTIVE },
      // });
      const roles = await this.rolesRepo.find({
        where: {
          status: DepartmentStatus.ACTIVE,
          // superAdm: Not(IsSuperAdmin.YES),
        },
      });

      // const options = [];
      // if (departments.length > 0 && roles.length > 0) {
      //   departments.forEach((department) => {
      //     let mergeStr = '';
      //     roles.forEach((role) => {
      //       mergeStr = `${department.name}-${role.name}`;
      //       options.push({
      //         value: `${department.id}|${role.id}`,
      //         label: mergeStr,
      //       });
      //     });
      //   });
      // }
      const options = roles.map((role) => ({
        value: role.id,
        label: role.name,
      }));

      return options;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  rolesTest(
    roles: [string],
    departments: [string],
  ): { allowedRoles: [string]; allowedDepartments: [string] } {
    return {
      allowedRoles: roles,
      allowedDepartments: departments,
    };
  }
}
