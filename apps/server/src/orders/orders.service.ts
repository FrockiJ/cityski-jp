import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import {
  CreateOrderRequestDTO,
  GetOrdersRequestDTO,
  GetOrdersResponseDTO,
  ResWithPaginationDTO,
} from '@repo/shared';
import { Order } from './entities/order.entity';
import { Department } from 'src/departments/entities/department.entity';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionsService } from 'src/transaction/transactions.service';

@Injectable()
export class OrdersService {
  constructor(
    // repository injection
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
    @InjectRepository(CoursePlan)
    private readonly coursePlansRepo: Repository<CoursePlan>,
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
  ) {}

  // get order list of all
  async getOrders(
    request: GetOrdersRequestDTO,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    console.log('request', request);
    try {
      const orders = await this.ordersRepo.find();

      // const ordersResponse = orders.map(() => {});
      const total = orders.length;
      const limit = request.limit || 10;

      const formatData = orders.map((order) => ({
        id: order.id,
        courseName: 'order.coursePlan.name',
        price: 1000,
        status: order.status,
        paymentStatus: 1,
        number: order.planNumber,
        people: order.adultCount + order.childCount,
        process: 1,
        createdTime: order.createdTime,
      }));

      const res = {
        data: formatData,
        total: 0,
        page: 1,
        limit: 10,
        pages: Math.ceil(total / limit),
      };
      return res;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   * 第1碼：課程類型
   * G：團體課
   * P：私人課
   * I：個人練習
   * 第2碼：授課板類
   * 1：單板
   * 2：雙板
   * 第3碼：預約形式
   * 1：預約：預約時間
   * 2：指定：指定時間
   * 第4~7碼：訂購西元年YYYY
   * 第8~9碼：訂購月份MM
   * 第10~11碼：訂購日期DD
   * 第12~15碼：流程編號，Max(no) + 1
   */
  async generateOrderNo(
    type: string,
    skiType: string,
    bkgType: string,
    queryRunner?: QueryRunner,
  ): Promise<string> {
    try {
      // 查詢當前 type 的最大編號
      let lastItem = null;
      if (queryRunner) {
        lastItem = await queryRunner.manager.findOne(Order, {
          where: { type },
          order: { no: 'DESC' }, // 取第一筆
        });
      } else {
        lastItem = await this.ordersRepo.findOne({
          where: { type },
          order: { no: 'DESC' }, // 取第一筆
        });
      }
      const toDay = new Date();
      const year = toDay.getFullYear();
      const month =
        toDay.getMonth() + 1 < 10
          ? `0${toDay.getMonth() + 1}`
          : toDay.getMonth() + 1;
      const day =
        toDay.getDate() < 10 ? `0${toDay.getDate()}` : toDay.getDate();
      let nextNo = 1;

      if (lastItem) {
        // 提取數字
        const lastNo = parseInt(lastItem.no.slice(11), 10);
        nextNo = lastNo + 1;
      }

      // 格式化加上type
      return `${type}${skiType}${bkgType}${year}${month}${day}${nextNo.toString().padStart(4, '0')}`;
    } catch (err) {
      throw new HttpException(
        `Error when attempting to generate a number with generateNo: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createOrder(body: CreateOrderRequestDTO, memberId: string) {
    console.log('body', body);
    try {
      const department = await this.departmentsRepo.findOne({
        where: { id: body.departmentId },
      });
      if (!department) {
        throw new CustomException(
          `departmentId: ${body.departmentId} is not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const coursePlan = await this.coursePlansRepo.findOne({
        where: { id: body.coursePlanId },
      });
      if (!coursePlan) {
        throw new CustomException(
          `coursePlanId: ${body.coursePlanId} is not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (body.adultCount < 1 && body.childCount < 1) {
        throw new CustomException(
          `The total of adultCount and childCount must be greater than 0`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // coursePlanId: request.coursePlanId,
      // discountCode
      const savedOrder = this.ordersRepo.create({
        ...new Order(),
        no: await this.generateOrderNo(body.type, body.skiType, body.bkgType),
        orderer: memberId,
        type: body.type,
        skiType: body.skiType,
        bkgType: body.bkgType,
        planNumber: body.planNumber,
        planType: body.planType,
        adultCount: body.adultCount,
        childCount: body.childCount,
        channel: body.channel,
        status: body.status,
        createdUser: memberId,
        updatedUser: memberId,
        // 設定cascade可一起儲存關聯資料
        department: department,
        coursePlan: coursePlan,
      });
      console.log('savedOrder', savedOrder);

      this.ordersRepo.save(savedOrder);

      // todo: 創order同時要創交易資料 尚未完成
      if (savedOrder) this.transactionsService.createTransaction(savedOrder);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
