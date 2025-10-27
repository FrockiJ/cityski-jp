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
  GetOrderDetailResponseDTO,
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
import { OrderMembersService } from 'src/order-members/order-members.service';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';

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
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
    @InjectRepository(OrderMember)
    private readonly orderMembersRepo: Repository<OrderMember>,
    @InjectRepository(ReservationMember)
    private readonly reservationMembersRepo: Repository<ReservationMember>,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    @Inject(forwardRef(() => OrderMembersService))
    private readonly orderMembersService: OrderMembersService,
  ) {}

  // get order list of all
  async getOrders(
    request: GetOrdersRequestDTO,
  ): Promise<ResWithPaginationDTO<any[]>> {
    console.log('request', request);
    try {
      const queryBuilder = this.ordersRepo.createQueryBuilder('o')
        .leftJoinAndSelect('o.member', 'member')
        .leftJoinAndSelect('o.coursePlan', 'coursePlan');

      // 根據部門ID篩選
      if (request.departmentId) {
        queryBuilder.andWhere('o.department_id = :departmentId', {
          departmentId: request.departmentId,
        });
      }

      // 根據狀態篩選
      if (request.status !== undefined && request.status !== null) {
        queryBuilder.andWhere('o.status = :status', {
          status: request.status,
        });
      }

      // 根據關鍵字搜索會員姓名或訂單編號
      if (request.keyword) {
        queryBuilder.andWhere(
          '(member.name LIKE :keyword OR o.no LIKE :keyword)',
          { keyword: `%${request.keyword}%` }
        );
      }

      // 排序：最新的訂單在前
      queryBuilder.orderBy('o.createdTime', 'DESC');

      const orders = await queryBuilder.getMany();

      const customPage =
        isNaN(Number(request.page)) || request.page <= 0
          ? 1
          : Number(request.page);
      const customLimit =
        isNaN(Number(request.limit)) || request.limit <= 0
          ? 10
          : Number(request.limit);

      // 分頁處理
      const startIndex = (customPage - 1) * customLimit;
      const endIndex = startIndex + customLimit;
      const paginatedOrders = orders.slice(startIndex, endIndex);

      const total = orders.length;

      const res = {
        data: paginatedOrders,
        total,
        page: customPage,
        limit: customLimit,
        pages: Math.ceil(total / customLimit),
      };

      return res;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // get order detail by id
  async getOrderDetail(id: string): Promise<GetOrderDetailResponseDTO> {
    try {
      const order = await this.ordersRepo.findOne({
        where: { id },
        relations: ['member', 'coursePlan', 'coursePlan.course', 'department', 'orderMembers', 'orderMembers.member'],
      });

      if (!order) {
        throw new CustomException(
          `Order with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const orderDetail: GetOrderDetailResponseDTO = {
        id: order.id,
        no: order.no,
        type: order.type,
        skiType: order.skiType,
        bkgType: order.bkgType,
        planNumber: order.planNumber,
        adultCount: order.adultCount || 0,
        childCount: order.childCount || 0,
        channel: order.channel,
        status: order.status,
        createdTime: order.createdTime,
        expDate: order.expDate,
        ordererName: order.member?.name || '',
        ordererPhone: order.member?.phone || '',
        coursePlanName: order.coursePlan?.name || '',
        coursePlanImage: '',
        coursePlanDescription: order.coursePlan?.course?.description || '',
        departmentName: order.department?.name || '',
        orderMembers: order.orderMembers?.map((om) => ({
          id: om.id,
          memberId: om.memberId,
          memberName: om.member?.name || '',
          memberPhone: om.member?.phone || '',
          memberBirthday: om.member?.birthday,
          snowboard: om.member?.snowboard || 1,
          skis: om.member?.skis || 1,
          courseCount: om.courseCount,
          courseLeft: om.courseLeft,
        })) || [],
      };

      return orderDetail;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
    skiType: number,
    bkgType: number,
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

      await this.ordersRepo.save(savedOrder);

      // 創建 order-member 記錄
      if (savedOrder) {
        const totalCourseCount = body.planNumber || 0;
        await this.orderMembersService.create({
          orderId: savedOrder.id,
          memberId: memberId,
          courseCount: totalCourseCount,
          courseLeft: totalCourseCount,
        });

        // todo: 創order同時要創交易資料 尚未完成
        this.transactionsService.createTransaction(savedOrder);
      }
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 獲取訂單相關的預約列表
  // 關聯邏輯: Order -> OrderMember -> ReservationMember -> Reservation
  async getOrderReservations(orderId: string): Promise<any[]> {
    try {
      // 先驗證訂單是否存在
      const order = await this.ordersRepo.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new CustomException(
          `Order with id: ${orderId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // 查詢該訂單的所有 order members
      const orderMembers = await this.orderMembersRepo.find({
        where: { orderId },
      });

      if (orderMembers.length === 0) {
        return [];
      }

      // 獲取所有 order member IDs
      const orderMemberIds = orderMembers.map(om => om.id);

      // 查詢這些 order members 關聯的所有 reservation members
      const reservationMembers = await this.reservationMembersRepo.find({
        where: orderMemberIds.map(id => ({ orderMemberId: id })),
        relations: ['reservation', 'reservation.department'],
      });

      // 提取唯一的 reservations（去重）
      const uniqueReservations = new Map();

      reservationMembers.forEach(rm => {
        if (rm.reservation && !uniqueReservations.has(rm.reservation.id)) {
          uniqueReservations.set(rm.reservation.id, rm.reservation);
        }
      });

      // 轉換為陣列並格式化回傳
      const reservations = Array.from(uniqueReservations.values()).map(reservation => ({
        id: reservation.id,
        reservationNo: reservation.reservationNo,
        reservationStatus: reservation.reservationStatus,
        classTime: reservation.classTime,
        teachingLevel: reservation.teachingLevel,
        instructor: reservation.instructor,
        departmentId: reservation.department?.id || null,
        createdTime: reservation.createdTime,
        updatedTime: reservation.updatedTime,
        department: reservation.department ? {
          id: reservation.department.id,
          name: reservation.department.name,
        } : null,
      }));

      // 按照上課時間排序（最新的在前）
      reservations.sort((a, b) => {
        return new Date(b.classTime).getTime() - new Date(a.classTime).getTime();
      });

      return reservations;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
