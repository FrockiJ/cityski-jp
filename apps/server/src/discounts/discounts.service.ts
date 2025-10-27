import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
import {
  CreateDiscountRequestDTO,
  ResWithPaginationDTO,
  GetDiscountRequestDTO,
  GetDiscountResponseDTO,
  OrderType,
  UpdateDiscountRequestDTO,
  CheckDiscountCodeRequestDTO,
  DiscountType,
  DiscountStatus,
  GetClientDiscountResponseDTO,
} from '@repo/shared';
import { Department } from 'src/departments/entities/department.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { Cron } from '@nestjs/schedule';
import { log } from 'console';
// import { Cron } from '@nestjs/schedule';

@Injectable()
export class DiscountsService {
  constructor(
    // repository injection
    @InjectRepository(Discount)
    private readonly discountRepo: Repository<Discount>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getDiscounts(
    query: GetDiscountRequestDTO,
  ): Promise<ResWithPaginationDTO<GetDiscountResponseDTO[]>> {
    try {
      // const [discounts, total] = await this.discountRepo.findAndCount();

      const queryBuilder = this.discountRepo.createQueryBuilder('discount');

      // filter keyword
      if (query.keyword?.trim()) {
        queryBuilder.andWhere(
          'discount.code ILIKE :code OR discount.note ILIKE :note',
          {
            code: `%${query.keyword.trim()}%`,
            note: `%${query.keyword.trim()}%`,
          },
        );
      }

      queryBuilder.andWhere('discount.department_id = :departmentId', {
        departmentId: query.departmentId,
      });

      // filter status
      if (query.status && query.status.trim()) {
        const statusArr = query.status.split(',').map(Number);
        const hasExpiredStatus = statusArr.includes(DiscountStatus.EXPIRED);
        const filteredStatusArr = statusArr.filter(
          (status) => status !== DiscountStatus.EXPIRED,
        );
        const todayDate = new Date().toISOString().split('T')[0];

        // Expired status is not include in status of db schema, so add extra condition
        if (hasExpiredStatus && filteredStatusArr.length > 0) {
          // Include both specified statuses (not expired) and expired discounts
          queryBuilder.andWhere(
            `(discount.status IN (:...statusArr) AND DATE(discount.endDate) >= :today) OR (DATE(discount.endDate) < :today)`,
            {
              statusArr: filteredStatusArr,
              today: todayDate,
            },
          );
        } else if (hasExpiredStatus) {
          // Only show expired discounts
          queryBuilder.andWhere('DATE(discount.endDate) < :today', {
            today: todayDate,
          });
        } else {
          // Filter by specific statuses without expired ones
          queryBuilder.andWhere(`discount.status IN (:...statusArr)`, {
            statusArr,
          });
        }
      }

      // filter CreatedTime, DATE只會針對年月日查詢
      if (query.startCreatedTime && query.endCreatedTime) {
        queryBuilder.andWhere(
          'DATE(discount.createdTime) >= :startCreatedTime AND DATE(discount.createdTime) <= :endCreatedTime',
          {
            startCreatedTime: new Date(query.startCreatedTime),
            endCreatedTime: new Date(query.endCreatedTime),
          },
        );
      }
      // filter endDate, DATE只會針對年月日查詢
      if (query.startExpireTime && query.endExpireTime) {
        queryBuilder.andWhere(
          'DATE(discount.endDate) >= :startExpireTime AND DATE(discount.endDate) <= :endExpireTime',
          {
            startExpireTime: new Date(query.startExpireTime),
            endExpireTime: new Date(query.endExpireTime),
          },
        );
      }

      // sort
      queryBuilder.orderBy(
        query.sort ? `discount.${query.sort}` : 'discount.createdTime',
        query.order ? (query.order === OrderType.ASC ? 'ASC' : 'DESC') : 'DESC',
      );

      // pagination
      const formatPage = query.page || 1;
      let formatLimit = 0;
      if (!query.limit) {
        formatLimit = await this.discountRepo.count();
      } else {
        formatLimit = query.limit;
      }
      queryBuilder.offset((formatPage - 1) * formatLimit).limit(formatLimit);

      const discounts = await queryBuilder.getMany();

      const total = await queryBuilder.getCount();
      const limit = formatLimit; // per count
      const page = formatPage; // current page

      const formattedDiscounts = await Promise.all(
        discounts.map(async (discount) => {
          const isExpired = new Date(discount.endDate) < new Date();
          const isUsed = await this.isDiscountUsed(discount.id);

          // 計算刪除限制原因
          let deleteReason: string | undefined;
          if (isUsed) {
            deleteReason = '此折扣碼已被使用無法刪除';
          } else if (isExpired) {
            deleteReason = '此折扣碼已過期無法刪除';
          }

          return {
            id: discount.id,
            status: isExpired ? 9 : discount.status,
            type: discount.type,
            discount: discount.discount,
            code: discount.code,
            note: discount.note,
            usageLimit: discount.usageLimit,
            createdTime: discount.createdTime,
            endDate: discount.endDate,
            isUsed,
            deleteReason,
          };
        }),
      );

      const res = {
        data: formattedDiscounts,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
      return res;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDiscountByCodeAndDepartmentId(
    departmentId: string,
    code: string,
  ): Promise<Discount> {
    const discount = await this.discountRepo.findOne({
      where: { code, department: { id: departmentId } },
      relations: ['department'],
    });

    console.log('discount', discount);
    return discount;
  }

  async checkDiscountCode(query: CheckDiscountCodeRequestDTO) {
    try {
      const { departmentId, code } = query;
      const discount = await this.getDiscountByCodeAndDepartmentId(
        departmentId,
        code,
      );

      if (discount) {
        throw new CustomException(
          '此折扣碼已被使用，請輸入新的折扣碼',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createDiscount(
    body: CreateDiscountRequestDTO,
    userId: string,
  ): Promise<any> {
    try {
      const {
        code,
        type,
        status,
        discount,
        endDate,
        usageLimit,
        note,
        departmentId,
      } = body;

      // check code
      const findDiscount = await this.getDiscountByCodeAndDepartmentId(
        departmentId,
        code,
      );
      console.log('status', Number(status));
      if (
        Number(status) !== DiscountStatus.ACTIVE &&
        Number(status) !== DiscountStatus.INACTIVE
      ) {
        throw new CustomException('狀態輸入錯誤', HttpStatus.BAD_REQUEST);
      }
      if (findDiscount) {
        throw new CustomException(
          '此折扣碼已被使用，請輸入新的折扣碼',
          HttpStatus.BAD_REQUEST,
        );
      }

      // check date
      const nowD = new Date();
      const endD = new Date(`${endDate} 23:59:59`);
      if (nowD > endD) {
        throw new CustomException(
          '到期日期不可小於今日',
          HttpStatus.BAD_REQUEST,
        );
      }
      // discount check
      if (type === DiscountType.PERCENT && (discount > 10 || discount < 0)) {
        throw new CustomException(
          '折扣類型是折扣比例時，折扣須在0到10之間',
          HttpStatus.BAD_REQUEST,
        );
      }
      const savedDepartment = this.departmentRepo.create({
        ...new Department(),
        id: departmentId,
      });

      const savedDiscount = this.discountRepo.create({
        ...new Discount(),
        code,
        type,
        status,
        discount,
        usageLimit,
        note,
        department: savedDepartment,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(`${endDate} 23:59:59`),
        createdUser: userId,
        updatedUser: userId,
      });
      await this.discountRepo.save(savedDiscount);
      return savedDiscount;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateDiscount(body: UpdateDiscountRequestDTO, userId: string) {
    try {
      const { id, status } = body;
      const discount = await this.discountRepo.findOne({ where: { id } });
      if (!discount) {
        throw new CustomException('此id不存在', HttpStatus.BAD_REQUEST);
      }

      if (discount.endDate < new Date()) {
        throw new CustomException('此折扣碼已過期', HttpStatus.BAD_REQUEST);
      }
      if (
        Number(status) !== DiscountStatus.ACTIVE &&
        Number(status) !== DiscountStatus.INACTIVE
      ) {
        throw new CustomException('狀態輸入錯誤', HttpStatus.BAD_REQUEST);
      }
      const savedDiscount = this.discountRepo.create({
        ...discount,
        status,
        updatedTime: new Date(),
        updatedUser: userId,
      });
      await this.discountRepo.save(savedDiscount);
      return savedDiscount;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateStatus(discountId: string, userId: string) {
    try {
      const discount = await this.discountRepo.findOne({
        where: { id: discountId },
      });
      if (!discount) {
        throw new CustomException('折扣碼不存在', HttpStatus.BAD_REQUEST);
      }
      if (discount.status === DiscountStatus.EXPIRED) {
        throw new CustomException('折扣碼已過期', HttpStatus.BAD_REQUEST);
      }
      const savedDiscount = this.discountRepo.create({
        ...discount,
        status:
          discount.status === DiscountStatus.ACTIVE
            ? DiscountStatus.INACTIVE
            : DiscountStatus.ACTIVE,
        updatedTime: new Date(),
        updatedUser: userId,
      });
      await this.discountRepo.save(savedDiscount);
      return savedDiscount;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 檢查折扣碼是否已被使用（綁定到訂單）
   */
  private async isDiscountUsed(discountId: string): Promise<boolean> {
    const order = await this.orderRepo.findOne({
      where: { discountId: discountId as any },
    });
    return !!order;
  }

  /**
   * 檢查折扣碼是否可以刪除（狀態檢查）
   * 規則：
   * 1. 是否已被使用：若該折扣碼已綁定訂單或被使用過，則不可刪除，只能設為「停用」
   * 2. 是否仍在有效期內：若仍在有效期但尚未使用、未綁定任何行銷活動，可刪除
   */
  async validateDeleteDiscount(
    id: string,
  ): Promise<{ canDelete: boolean; reason?: string }> {
    const discount = await this.discountRepo.findOne({ where: { id } });
    if (!discount) {
      throw new CustomException('此id不存在', HttpStatus.BAD_REQUEST);
    }

    // 條件 1：檢查是否已被使用
    const isUsed = await this.isDiscountUsed(id);
    if (isUsed) {
      return {
        canDelete: false,
        reason: '此折扣碼已被使用無法刪除，只能設為停用',
      };
    }

    // 條件 2：檢查是否仍在有效期內
    const isExpired = new Date(discount.endDate) < new Date();
    if (isExpired) {
      return {
        canDelete: false,
        reason: '此折扣碼已過期無法刪除',
      };
    }

    // 如果通過上述檢查，則可以刪除
    return { canDelete: true };
  }

  async deleteDiscount(id: string, userId: string) {
    try {
      // 條件 A：檢查使用狀態和過期日期
      const { canDelete: canDeleteByStatus, reason: statusReason } =
        await this.validateDeleteDiscount(id);
      if (!canDeleteByStatus) {
        throw new CustomException(statusReason, HttpStatus.BAD_REQUEST);
      }

      // 先取得折扣碼（並載入關聯的 department）
      const discount = await this.discountRepo.findOne({
        where: { id },
        relations: ['department'],
      });

      if (!discount) {
        throw new CustomException('此id不存在', HttpStatus.BAD_REQUEST);
      }

      // 條件 B：檢查權限（admin 或部門相符）
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: [
          'userRolesDepartments',
          'userRolesDepartments.role',
          'userRolesDepartments.department',
        ],
      });

      if (!user) {
        throw new CustomException('使用者不存在', HttpStatus.BAD_REQUEST);
      }

      const userRoles = user.userRolesDepartments.map((urd) => ({
        roleId: urd.role.id,
        roleName: urd.role.name,
        departmentId: urd.department.id,
      }));

      const isAdmin = userRoles && userRoles.some((ur) => ur.roleName === 'admin');

      if (!isAdmin && userRoles && userRoles.length > 0) {
        // 非 admin：檢查部門是否相符
        const userDepartmentIds = userRoles.map((ur) => ur.departmentId);
        const hasDepartmentAccess = userDepartmentIds.includes(discount.department.id);

        if (!hasDepartmentAccess) {
          throw new CustomException(
            '此折扣碼不屬於您的授權部門',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      // 執行刪除
      await this.discountRepo.remove(discount);
      return discount;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 每日00:00檢查是否有到期折扣碼停用
   * status to 0
   */
  @Cron('0 0 * * *')
  async scheduleEndDate() {
    try {
      const discounts = await this.discountRepo.find({
        where: { endDate: LessThanOrEqual(new Date()) },
      });

      const expiredDiscounts = discounts.map((discount) => ({
        ...discount,
        status: DiscountStatus.EXPIRED,
      }));
      await this.discountRepo.save(expiredDiscounts);
      return expiredDiscounts;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /********************************************
   *              -- CLIENT --                *
   ********************************************/

  async clientGetDiscount(
    query: CheckDiscountCodeRequestDTO,
  ): Promise<GetClientDiscountResponseDTO> {
    const { departmentId, code } = query;
    const discount = await this.getDiscountByCodeAndDepartmentId(
      departmentId,
      code,
    );
    if (!discount) {
      throw new CustomException(
        'Discount code is not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = {
      id: discount.id,
      departmentId: discount.department.id,
      code: discount.code,
      type: discount.type,
      discount: 8,
      status: discount.status,
      usageLimit: discount.usageLimit,
      usageCount: 0, // todo: 等訂單做完才可以算
    };
    return response;
  }
}
