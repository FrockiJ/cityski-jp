import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { MenuService } from 'src/menu/menu.service';
import {
  CreateRoleRequestDTO,
  GetRoleByNameResponseDTO,
  GetRoleDetailResponseDTO,
  GetRolesRequestDTO,
  IsSuperAdmin,
  OrderType,
  ResWithPaginationDTO,
  Roles,
  RoleStatus,
  UserStatus,
} from '@repo/shared';
import { CustomException } from 'src/common/exception/custom.exception';
import { UpdateRoleRequestDTO } from '@repo/shared';
import { GetRolesResponseDTO } from '@repo/shared';
import { UserRolesDepartments } from 'src/users/entities/userRolesDepartments.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesService {
  constructor(
    // repository injection
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(UserRolesDepartments)
    private urdRepo: Repository<UserRolesDepartments>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  // do from menuService
  async initialize() {
    // default account

    try {
      await this.createRole({
        name: Roles.SUPER_ADMIN,
        superAdm: IsSuperAdmin.YES,
        status: RoleStatus.ACTIVE,
        menuIds: [],
      });
    } catch (error) {
      console.log('role error', error);
    }
  }

  // gets a single role
  async getRoleByName(name: string): Promise<GetRoleByNameResponseDTO> {
    try {
      const role = await this.rolesRepo.findOne({ where: { name } });

      if (role) {
        delete role.updatedTime;
        delete role.createdTime;
      }
      return role;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }
  // gets a single role
  async getRoleById(id: string): Promise<Role> {
    try {
      const role = await this.rolesRepo.findOne({ where: { id } });
      return role;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // gets roles with pagination
  async getRoles(
    getRolesRequestDTO: GetRolesRequestDTO,
  ): Promise<ResWithPaginationDTO<GetRolesResponseDTO[]>> {
    try {
      const queryBuilder = this.rolesRepo
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.userRolesDepartments', 'userRolesDepartments')
        .leftJoinAndSelect('userRolesDepartments.user', 'user')
        .select([
          'role.id',
          'role.name',
          'role.updatedTime',
          'role.status',
          'role.superAdm',
          'COUNT(userRolesDepartments.role_id) AS usageCount', // 計算每個角色的使用次數
        ])
        .groupBy(
          'role.id, role.name, role.updatedTime, role.status, role.superAdm',
        );

      // sort
      if (getRolesRequestDTO.sort === 'usageCount') {
        queryBuilder.orderBy(
          'usageCount',
          getRolesRequestDTO.order.toLocaleLowerCase() === OrderType.ASC
            ? 'ASC'
            : 'DESC',
        );
      } else {
        queryBuilder.orderBy(
          getRolesRequestDTO.sort
            ? `role.${getRolesRequestDTO.sort}`
            : 'role.updatedTime',
          getRolesRequestDTO.order
            ? getRolesRequestDTO.order.toLocaleLowerCase() === OrderType.ASC
              ? 'ASC'
              : 'DESC'
            : 'DESC',
        );
      }

      // filter null or active or inactive
      queryBuilder.andWhere(
        'user.status IS NULL OR user.status != :deleteStatus',
        {
          deleteStatus: UserStatus.DELETE,
        },
      );

      // filter date
      if (
        getRolesRequestDTO.startUpdatedTime &&
        getRolesRequestDTO.endUpdatedTime
      ) {
        queryBuilder.andWhere(
          'DATE(role.updatedTime) >= :startUpdatedTime AND DATE(role.updatedTime) <= :endUpdatedTime',
          {
            startUpdatedTime: new Date(getRolesRequestDTO.startUpdatedTime),
            endUpdatedTime: new Date(getRolesRequestDTO.endUpdatedTime),
          },
        );
      }
      // filter keyword
      if (getRolesRequestDTO.keyword?.trim()) {
        queryBuilder.andWhere('role.name ILIKE :name', {
          name: `%${getRolesRequestDTO.keyword.trim()}%`,
        });
      }

      // pagination
      const formatPage = getRolesRequestDTO.page || 1;
      let formatLimit = 0;
      if (!getRolesRequestDTO.limit) {
        formatLimit = await this.rolesRepo.count();
      } else {
        formatLimit = getRolesRequestDTO.limit;
      }

      const total = await queryBuilder.getCount();

      const roles = await queryBuilder
        .offset((formatPage - 1) * formatLimit)
        .limit(formatLimit)
        .getRawMany();

      const formatRoles = roles.map((role) => {
        return {
          updatedTime: role.role_updated_time,
          id: role.role_id,
          name: role.role_name,
          superAdm: role.role_super_adm,
          status: role.role_status,
          usageCount: Number(role.usagecount),
        };
      });

      const limit = formatLimit; // per count
      const page = formatPage; // current page

      const res = {
        data: formatRoles,
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

  // create role
  async createRole(createRoleDTO: CreateRoleRequestDTO) {
    try {
      // find if user exists already to prevent duplicate users
      const role = await this.getRoleByName(createRoleDTO.name.trim());

      const superAdmin = await this.usersService.getSuperAdmin();
      if (role) {
        throw new CustomException(`角色名稱重複`, HttpStatus.BAD_REQUEST);
      }

      if (
        createRoleDTO.superAdm === IsSuperAdmin.NO &&
        createRoleDTO.menuIds.length === 0
      ) {
        throw new CustomException(`至少須勾選一個權限`, HttpStatus.BAD_REQUEST);
      }

      if (createRoleDTO.superAdm === IsSuperAdmin.YES && superAdmin) {
        throw new CustomException(`系統管理員已存在`, HttpStatus.BAD_REQUEST);
      }

      let newRole: Role;
      if (createRoleDTO.superAdm === IsSuperAdmin.YES && !superAdmin) {
        const menus = await this.menuService.getMenu();
        const menuIds = [];
        menus.forEach((menu) => {
          menuIds.push(menu.id);
          menu.subPages.forEach((subPage) => {
            menuIds.push(subPage.id);
          });
        });
        newRole = this.rolesRepo.create({
          ...new Role(),
          ...createRoleDTO,
          menus: menuIds.map((menuId) => ({ id: menuId })),
        });
        console.log('menuIds', menuIds);
      } else {
        const { menuIds, ...others } = createRoleDTO;
        const formatIdList = menuIds.map((id) => ({ id }));
        newRole = this.rolesRepo.create({
          ...new Role(),
          ...others,
          superAdm: IsSuperAdmin.NO,
          status: RoleStatus.ACTIVE,
          menus: formatIdList,
        });
      }
      // save new role to db
      await this.rolesRepo.save(newRole);
      // return;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      // throw error if user can't be saved
      // throw new HttpException(err.message, 500);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // update role
  async updateRole(updateData: UpdateRoleRequestDTO) {
    try {
      const role = await this.getRoleById(updateData.id);

      if (!role) {
        throw new CustomException('此id無對應角色', HttpStatus.BAD_REQUEST);
      }

      // superAdmin can only edit name
      if (role.superAdm === IsSuperAdmin.YES) {
        Object.assign(role, {
          ...role,
          name: updateData.name,
          updatedTime: new Date(),
        });
      } else {
        const formatIdList = updateData.menuIds.map((id: string) => ({ id }));
        Object.assign(role, {
          ...role,
          name: updateData.name,
          menus: formatIdList,
          updatedTime: new Date(),
        });
      }

      await this.rolesRepo.save(role);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // delete role
  async deleteRole(id: string) {
    try {
      const role = await this.getRoleById(id);
      if (!role) {
        throw new CustomException('此id無對應角色', HttpStatus.BAD_REQUEST);
      }
      if (role.superAdm === IsSuperAdmin.YES) {
        throw new CustomException('無法刪除系統管理員', HttpStatus.BAD_REQUEST);
      }

      // remove role
      await this.rolesRepo.remove(role);
      return;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // trigger role status
  async roleStatus(id: string) {
    try {
      const role = await this.getRoleById(id);
      if (!role) {
        throw new CustomException('此id無對應角色', HttpStatus.BAD_REQUEST);
      }
      if (role.superAdm === IsSuperAdmin.YES) {
        throw new CustomException('無法停用系統管理員', HttpStatus.BAD_REQUEST);
      }
      const isRoleUsing = await this.urdRepo.findOne({
        where: { role: { id } },
      });
      if (!!isRoleUsing && role.status === RoleStatus.ACTIVE) {
        throw new CustomException('請先移除後台人員', HttpStatus.BAD_REQUEST);
      }

      Object.assign(role, {
        ...role,
        status:
          role.status === RoleStatus.INACTIVE
            ? RoleStatus.ACTIVE
            : RoleStatus.INACTIVE,
      });
      // remove role
      await this.rolesRepo.save(role);
      // return;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async roleDetail(id: string): Promise<GetRoleDetailResponseDTO> {
    try {
      const subQuery = this.rolesRepo
        .createQueryBuilder('role')
        .innerJoin('role.menus', 'menu')
        .innerJoin('menu.subPages', 'subPage')
        .innerJoin('subPage.roles', 'subPageRole')
        .where('subPageRole.id = :subPageRoleId', {
          subPageRoleId: id,
        })
        .select('subPageRole.id');

      const roleWithMenus = await this.rolesRepo
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.menus', 'menu')
        .leftJoinAndSelect('menu.subPages', 'subPage')
        .leftJoin('subPage.roles', 'subPageRole')
        .where('role.id = :id', { id })
        .andWhere('menu.parent IS NULL')
        .andWhere(
          `(subPageRole.id IS NULL OR subPageRole.id IN (${subQuery.getQuery()}))`,
        )
        .setParameters(subQuery.getParameters())
        .orderBy('menu.sequence', 'ASC')
        .addOrderBy('subPage.sequence', 'ASC')
        .getOne();

      if (!roleWithMenus) {
        throw new CustomException('角色id不存在', HttpStatus.BAD_REQUEST);
      }

      const menuIds = [];

      roleWithMenus.menus.forEach((menu) => {
        menuIds.push(menu.id);
        if (menu.subPages.length > 0) {
          menu.subPages.forEach((subMenu) => {
            menuIds.push(subMenu.id);
          });
        }
      });

      const formattedRoleDetail = {
        id: roleWithMenus.id,
        name: roleWithMenus.name,
        superAdm: roleWithMenus.superAdm as IsSuperAdmin,
        status: roleWithMenus.status as RoleStatus,
        menuIds: menuIds,
      };
      return formattedRoleDetail;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
