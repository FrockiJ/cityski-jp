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
import { CustomException } from 'src/common/exception/custom.exception';
import { Cron } from '@nestjs/schedule';
// import { Cron } from '@nestjs/schedule';

@Injectable()
export class DiscountsService {
  constructor(
    // repository injection
    @InjectRepository(Discount)
    private readonly discountRepo: Repository<Discount>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
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
      if (query.status) {
        const statusArr = query.status.split(',').map(Number);
        const hasExpiredStatus = statusArr.includes(DiscountStatus.EXPIRED);

        // Expired status is not include in status of db schema, so add extra condition
        if (hasExpiredStatus) {
          queryBuilder.andWhere(
            `discount.status IN (:...statusArr) OR DATE(discount.endDate) < :today`,
            {
              statusArr: statusArr.filter(
                (status) => status !== DiscountStatus.EXPIRED,
              ),
              today: new Date(),
            },
          );
        } else {
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

      const formattedDiscounts = discounts.map((discount, index) => {
        const isExpired = new Date(discount.endDate) < new Date();
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
          isUsed: index % 2 ? false : true,
        };
      });

      const res = {
        data: formattedDiscounts,
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
      throw new HttpException(err.message, 500);
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
    } catch (err) {
      throw new HttpException(err.message, 500);
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
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, 500);
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
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async deleteDiscount(id: string) {
    try {
      const discount = await this.discountRepo.findOne({ where: { id } });
      if (!discount) {
        throw new CustomException('此id不存在', HttpStatus.BAD_REQUEST);
      }
      // todo: 判斷被使用中不能刪除
      // if(using from order) {

      // }
      this.discountRepo.remove(discount);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, 500);
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
      this.discountRepo.save(expiredDiscounts);
      return expiredDiscounts;
    } catch (err) {
      throw new HttpException(err.message, 500);
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
