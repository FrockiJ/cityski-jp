import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { menuItems } from 'src/shared/data/menu';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => DepartmentsService))
    private readonly departmentsService: DepartmentsService,
  ) {
    this.initialize();
  }

  initialize = async () => {
    await this.initDefaultMenu();
    await this.departmentsService.initialize();
    setTimeout(async () => {
      await this.rolesService.initialize();
      await this.usersService.initialize();
      // 在角色初始化後，同步選單到超級管理員
      await this.syncMenusToSuperAdmin();
    }, 2000);
  };
  /**
   * Creates the default menus for admin.
   **/
  initDefaultMenu = async () => {
    try {
      // check if all of menu exists
      const dbMenuItems = await this.getMenu();
      console.log('dbMenuItems:', dbMenuItems);
      const missingItems = [];

      // check for any menu items that have not been created or were deleted
      for (const menuItem of menuItems) {
        const found = dbMenuItems.find(
          (dbMenu) => dbMenu.name === menuItem.name,
        );

        if (!found) {
          console.log('found missing menu item:', menuItem);
          missingItems.push(menuItem);
        }
      }

      if (!missingItems.length) return;

      console.log('missingItems:', missingItems);

      // create any menu items that are not yet created
      missingItems.forEach(async (item) => {
        const createdMenuItem = await this.menuRepository.save(
          this.menuRepository.create(item),
        );

        // if there are subPages items, create them with parent reference
        // NOTE: Update to recursive function if there is more than one
        // tier of menu items, keeping it as a single nested loop now to
        // enhance readability.

        console.log('SubPages items:', item.subPages);

        if (item.subPages) {
          console.log('Creating subPages for item:', item.name);
          for (const subPagesItem of item.subPages) {
            const createdChildMenuItem = this.menuRepository.create({
              ...subPagesItem,
              parent: createdMenuItem,
            });

            await this.menuRepository.save(createdChildMenuItem);
          }
        } else {
        }
      });
    } catch (err) {
      console.log('err', err);
    }
  };

  getMenu = async () => {
    try {
      const menus = await this.menuRepository
        .createQueryBuilder('menus')
        .leftJoinAndSelect('menus.subPages', 'menusSubPages')
        // .leftJoinAndSelect('menus.parent', 'menusParent')
        // .leftJoinAndSelect('menusSubPages.parent', 'menusSubPagesParent')
        .andWhere('menus.parent IS NULL')
        .orderBy('menus.sequence', 'ASC')
        .addOrderBy('menusSubPages.sequence', 'ASC')
        .getMany();

      return menus;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  };

  /**
   * Syncs all menus to Super Admin role automatically
   * This ensures new menus are always available to Super Admin
   */
  syncMenusToSuperAdmin = async () => {
    try {
      // Find Super Admin role
      const superAdminRole = await this.roleRepository.findOne({
        where: { superAdm: 1 },
        relations: ['menus'],
      });

      if (!superAdminRole) {
        console.log('⚠ Super Admin role not found, skipping menu sync');
        return;
      }

      // Get all menus (both parent and child menus)
      const allMenus = await this.menuRepository.find();

      // Get currently assigned menu IDs
      const currentMenuIds = new Set(
        superAdminRole.menus.map((menu) => menu.id),
      );

      // Find new menus that are not yet assigned
      const newMenus = allMenus.filter((menu) => !currentMenuIds.has(menu.id));

      if (newMenus.length === 0) {
        console.log('✓ All menus already assigned to Super Admin');
        return;
      }

      // Add new menus to Super Admin
      superAdminRole.menus = [...superAdminRole.menus, ...newMenus];
      await this.roleRepository.save(superAdminRole);

      console.log(
        `✓ Synced ${newMenus.length} new menu(s) to Super Admin:`,
        newMenus.map((m) => m.name),
      );
    } catch (err) {
      console.log('Error syncing menus to Super Admin:', err.message);
    }
  };
}
