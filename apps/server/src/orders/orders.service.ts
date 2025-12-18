import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, QueryRunner, Repository } from 'typeorm';
import {
  CreateOrderRequestDTO,
  GetOrderDetailResponseDTO,
  GetOrdersRequestDTO,
  GetOrdersResponseDTO,
  ResWithPaginationDTO,
  ReservationResponseDto,
  OrderStatus,
  ReservationStatus,
} from '@repo/shared';
import { Order } from './entities/order.entity';
import { Department } from 'src/departments/entities/department.entity';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionsService } from 'src/transaction/transactions.service';
import { OrderMembersService } from 'src/order-members/order-members.service';
import { OrderInvitationsService } from 'src/order-invitations/order-invitations.service';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { Member } from 'src/members/entities/member.entity';

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
    @InjectRepository(OrderReservation)
    private readonly orderReservationsRepo: Repository<OrderReservation>,
    @InjectRepository(Member)
    private readonly membersRepo: Repository<Member>,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    @Inject(forwardRef(() => OrderMembersService))
    private readonly orderMembersService: OrderMembersService,
    @Inject(forwardRef(() => OrderInvitationsService))
    private readonly orderInvitationsService: OrderInvitationsService,
    private readonly dataSource: DataSource,
  ) {}

  // get order list of all
  async getOrders(
    request: GetOrdersRequestDTO,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    console.log('request', request);
    try {
      const queryBuilder = this.ordersRepo
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.member', 'member')
        .leftJoinAndSelect('o.coursePlan', 'coursePlan')
        .leftJoinAndSelect('o.orderReservations', 'orderReservations')
        .leftJoinAndSelect('orderReservations.reservation', 'reservation')
        .leftJoinAndSelect('o.transaction', 'transaction');

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
          { keyword: `%${request.keyword}%` },
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
      const resultPaginatedOrders: GetOrdersResponseDTO[] = paginatedOrders.map(
        (order) => ({
          ...order,
          courseName: order.coursePlan?.name || '課程名稱',
          price: order.transaction?.totalAmt || 0,
          paymentStatus: order.transaction?.status || 0,
          paymentInitiatedAt: order.transaction?.paymentInitiatedAt || null,
          depositDate: order.transaction?.depositDate || null,
          balancePaymentInitiatedAt: order.transaction?.balancePaymentInitiatedAt || null,
          number: order.planNumber,
          people: order.adultCount + order.childCount,
          process: order.orderReservations?.filter(
            (or) => or.reservation && or.reservation.reservationStatus !== ReservationStatus.CANCELED
          )?.length || 0,
        }),
      );

      const res = {
        data: resultPaginatedOrders,
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

  // get order by order number
  async getOrderByOrderNo(orderNo: string): Promise<Order | null> {
    try {
      const order = await this.ordersRepo.findOne({
        where: { no: orderNo },
        relations: ['transaction', 'member', 'coursePlan', 'department'],
      });

      return order;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get order detail by id
  async getOrderDetail(id: string): Promise<GetOrderDetailResponseDTO> {
    try {
      // Check if the id is a UUID or an order number
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      const order = await this.ordersRepo.findOne({
        where: isUUID ? { id } : { no: id },
        relations: [
          'member',
          'coursePlan',
          'coursePlan.course',
          'department',
          'orderMembers',
          'orderMembers.member',
          'transaction',
        ],
      });

      if (!order) {
        throw new CustomException(
          `Order with ${isUUID ? 'id' : 'order number'}: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Filter only active order members
      const activeOrderMembers =
        order.orderMembers?.filter((om) => om.active) || [];

      // Get pending invitations for this order
      const pendingInvitations =
        await this.orderInvitationsService.getPendingInvitationsByOrderId(order.id);

      const orderDetail: GetOrderDetailResponseDTO = {
        id: order.id,
        no: order.no,
        courseId: order.coursePlan?.course?.id || '',
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
        coursePlanId: order.coursePlan?.id || '',
        coursePlanName: order.coursePlan?.name || '',
        coursePlanImage: '',
        coursePlanDescription: order.coursePlan?.course?.description || '',
        departmentName: order.department?.name || '',
        orderMembers: activeOrderMembers.map((om) => ({
          id: om.id,
          memberId: om.memberId,
          memberName: om.member?.name || '',
          memberPhone: om.member?.phone || '',
          memberBirthday: om.member?.birthday,
          snowboard: om.member?.snowboard || 1,
          skis: om.member?.skis || 1,
          avatar: om.member?.avatar || '',
          orderNo: order.no,
          active: om.active,
        })),
        discountId: order.discountId,
        pendingInvitations: pendingInvitations || [],
        transaction: order.transaction ? {
          id: order.transaction.id,
          totalAmt: order.transaction.totalAmt,
          discountFee: order.transaction.discountFee,
          depositAmt: order.transaction.depositAmt,
          depositDate: order.transaction.depositDate,
          depositPaymentMethod: order.transaction.depositPaymentMethod,
          balanceAmt: order.transaction.balanceAmt,
          balanceDate: order.transaction.balanceDate,
          balancePaymentInitiatedAt: order.transaction.balancePaymentInitiatedAt,
          status: order.transaction.status,
          balancePaymentMethod: order.transaction.balancePaymentMethod,
          balanceInvoice: order.transaction.balanceInvoice,
          lastPaymentAttemptDate: order.transaction.lastPaymentAttemptDate,
          lastPaymentAttemptResult: order.transaction.lastPaymentAttemptResult,
        } : undefined,
      };

      return orderDetail;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get order list by member id (for client)
  async getOrdersByMemberId(
    memberId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    try {
      console.log('memberId', memberId);
      const customPage = isNaN(Number(page)) || page <= 0 ? 1 : Number(page);
      const customLimit =
        isNaN(Number(limit)) || limit <= 0 ? 10 : Number(limit);
      const skip = (customPage - 1) * customLimit;

      // 使用 QueryBuilder 来获取用户作为 orderer 或 orderMember 的所有订单
      const queryBuilder = this.ordersRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.coursePlan', 'coursePlan')
        .leftJoinAndSelect('order.department', 'department')
        .leftJoinAndSelect('order.transaction', 'transaction')
        .leftJoinAndSelect('order.orderReservations', 'orderReservations')
        .leftJoin('order.orderMembers', 'orderMember')
        .where(
          '(order.orderer = :memberId OR (orderMember.memberId = :memberId AND orderMember.active = :active))',
          { memberId, active: true },
        )
        .orderBy('order.createdTime', 'DESC')
        .distinct(true); // 确保不会因为多个 orderMembers 而重复

      // 获取总数
      const total = await queryBuilder.getCount();

      // 获取分页数据
      const orders = await queryBuilder.skip(skip).take(customLimit).getMany();

      const formatData = orders.map((order) => ({
        id: order.id,
        no: order.no,
        courseName: order.coursePlan?.name || '課程名稱',
        price: order.transaction?.totalAmt || 0,
        status: order.status,
        paymentStatus: order.transaction?.status || 0,
        number: order.planNumber,
        people: order.adultCount + order.childCount,
        process: order.status,
        createdTime: order.createdTime,
        paymentInitiatedAt: order.transaction?.paymentInitiatedAt || null,
        depositDate: order.transaction?.depositDate || null,
        balancePaymentInitiatedAt: order.transaction?.balancePaymentInitiatedAt || null,
      }));

      const res = {
        data: formatData,
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

  /**
   * 計算教學等級
   * 如果前台沒有提供課程等級，則使用所有成員中的最小等級 + 1
   * @param memberIds - 訂單成員 ID 列表
   * @param skiType - 滑板類型 (1: 單板, 2: 雙板)
   * @param providedLevel - 前台提供的等級(可選)
   * @returns 教學等級字符串
   */
  private async calculateTeachingLevel(
    memberIds: string[],
    skiType: number,
    providedLevel?: string,
  ): Promise<string> {
    // 如果前台已提供等級，直接使用
    if (providedLevel && providedLevel !== '-') {
      return providedLevel;
    }

    // 如果沒有成員，返回預設值
    if (!memberIds || memberIds.length === 0) {
      return '-';
    }

    try {
      // 查詢所有成員
      const members = await this.membersRepo.find({
        where: memberIds.map(id => ({ id })),
      });

      if (members.length === 0) {
        return '-';
      }

      // 根據滑板類型取得對應的等級
      const levels = members.map((member) => {
        if (skiType === 1) {
          // 單板
          return member.snowboard || 1;
        } else if (skiType === 2) {
          // 雙板
          return member.skis || 1;
        } else {
          // BOTH (0) - 取兩者中較小的
          return Math.min(member.snowboard || 1, member.skis || 1);
        }
      });

      // 找出最小等級
      const minLevel = Math.min(...levels);

      // 最小等級 + 1，但不超過 20
      console.log('minLevel', minLevel, levels);
      const calculatedLevel = Math.min(minLevel + 1, 20);

      return calculatedLevel.toString();
    } catch (error) {
      console.error('Error calculating teaching level:', error);
      return '-';
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
      // 查詢當前 type 的最大編號（包含所有狀態的訂單，包括已取消的）
      let lastItem = null;
      if (queryRunner) {
        lastItem = await queryRunner.manager
          .createQueryBuilder(Order, 'order')
          .where('order.type = :type', { type })
          .orderBy('order.no', 'DESC')
          .getOne();
      } else {
        lastItem = await this.ordersRepo
          .createQueryBuilder('order')
          .where('order.type = :type', { type })
          .orderBy('order.no', 'DESC')
          .getOne();
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
        relations: ['course', 'course.coursePeople', 'sessions'],
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

      // 驗證 #1: 個人練習需檢查是否上過課
      if (coursePlan.course.type === 'I') {
        const hasAttendedCourse = await this.reservationMembersRepo.findOne({
          where: {
            orderMember: {
              memberId: memberId,
            },
            attended: true,
          },
          relations: ['reservation', 'orderMember', 'orderMember.member'],
        });

        if (!hasAttendedCourse) {
          throw new CustomException(
            `會員必須先完成至少一堂課程才能預約個人練習 (Member must complete at least one course before booking individual practice)`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // 驗證 #2: 指定式個人練習檢查是否已被預約
      if (coursePlan.course.bkgType === 2 && coursePlan.course.type === 'I') {
        const existingOrder = await this.ordersRepo.findOne({
          where: {
            coursePlan: { id: body.coursePlanId },
            status: Not(OrderStatus.ORDER_CANCELED), // 排除已取消的訂單
          },
        });

        if (existingOrder) {
          throw new CustomException(
            `此個人練習時段已被預約 (This individual practice session is already booked)`,
            HttpStatus.CONFLICT,
          );
        }
      }
      let existingOrders = [];
      // 驗證 #3: 指定式團體課檢查是否額滿
      if (coursePlan.course.bkgType === 2 && coursePlan.course.type === 'G') {
        // 查詢該 coursePlan 的所有未取消訂單
        existingOrders = await this.ordersRepo.find({
          where: {
            coursePlan: { id: body.coursePlanId },
            status: Not(OrderStatus.ORDER_CANCELED), // 排除已取消的訂單
          },
        });

        // 計算現有總人數
        const currentTotalPeople = existingOrders.reduce(
          (sum, order) =>
            sum + (order.adultCount || 0) + (order.childCount || 0),
          0,
        );

        // 從 coursePeople 取得所有 maxPeople 的最小值
        const coursePeople = coursePlan.course.coursePeople || [];
        if (coursePeople.length === 0) {
          throw new CustomException(
            `課程人數設定不存在 (Course people configuration not found)`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const minMaxPeople = Math.min(
          ...coursePeople.map((cp) => cp.maxPeople),
        );
        const newTotalPeople =
          currentTotalPeople + body.adultCount + body.childCount;

        if (newTotalPeople > minMaxPeople) {
          throw new CustomException(
            `此團體課程已額滿，目前人數: ${currentTotalPeople}，最大容量: ${minMaxPeople} (This group course is full. Current: ${currentTotalPeople}, Max capacity: ${minMaxPeople})`,
            HttpStatus.CONFLICT,
          );
        }
      }

      // coursePlanId: request.coursePlanId,
      // discountCode

      // 生成訂單編號，如果重複則重試（最多 3 次）
      let orderNo: string;
      let retryCount = 0;
      const MAX_RETRIES = 10;

      while (retryCount < MAX_RETRIES) {
        orderNo = await this.generateOrderNo(body.type, body.skiType, body.bkgType);

        // 檢查訂單號是否已存在
        const existingOrder = await this.ordersRepo.findOne({
          where: { no: orderNo },
        });

        if (!existingOrder) {
          break; // 訂單號可用，跳出循環
        }

        retryCount++;
        console.warn(`Order number ${orderNo} already exists, retrying... (${retryCount}/${MAX_RETRIES})`);

        // 等待一小段時間再重試
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (retryCount === MAX_RETRIES) {
        throw new CustomException(
          'Failed to generate unique order number after multiple attempts',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const savedOrder = this.ordersRepo.create({
        ...new Order(),
        no: orderNo,
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

      if (savedOrder) {
        // 計算教學等級
        // 準備成員ID列表：如果有提供memberIds則使用，否則使用訂購者memberId
        const memberIdsForLevel = body.memberIds && body.memberIds.length > 0
          ? body.memberIds
          : [memberId];

        const teachingLevel = await this.calculateTeachingLevel(
          memberIdsForLevel,
          body.skiType,
          body.teachingLevel,
        );

        // 創建 order-member 記錄

        // 指定式個人練習須建立 reservation 和 order-reservation 關聯
        if (coursePlan.course.bkgType === 2 && coursePlan.course.type === 'I') {
          // 使用 transaction 確保資料一致性
          const queryRunner = this.dataSource.createQueryRunner();
          await queryRunner.connect();
          await queryRunner.startTransaction();

          try {
            // 根據 coursePlan.sessions 建立對應數量的 reservations
            if (coursePlan.sessions && coursePlan.sessions.length > 0) {
              for (const session of coursePlan.sessions) {
                // 0. 創建 OrderMember

                const orderMember = await this.orderMembersService.create({
                  orderId: savedOrder.id,
                  memberId: memberId,
                });

                // 1. 創建 Reservation
                const newReservation = queryRunner.manager.create(Reservation, {
                  reservationStatus: 1, // SCHEDULED
                  classTime: session.startTime,
                  teachingLevel: teachingLevel as any,
                  instructor: null,
                  department: department,
                  createdUser: memberId,
                  updatedUser: memberId,
                });
                const savedReservation =
                  await queryRunner.manager.save(newReservation);

                // 2. 創建 ReservationMember
                const newReservationMember = queryRunner.manager.create(
                  ReservationMember,
                  {
                    reservationId: savedReservation.id,
                    orderMemberId: orderMember.id,
                  },
                );
                await queryRunner.manager.save(newReservationMember);

                // 3. 創建 OrderReservation
                const newOrderReservation = queryRunner.manager.create(
                  OrderReservation,
                  {
                    orderId: savedOrder.id,
                    reservationId: savedReservation.id,
                    index: session.no - 1,
                  },
                );
                await queryRunner.manager.save(newOrderReservation);
              }
            }

            await queryRunner.commitTransaction();
          } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
          } finally {
            await queryRunner.release();
          }
        }

        // 指定式團體課須建立 reservation 和 order-reservation 關聯
        if (coursePlan.course.bkgType === 2 && coursePlan.course.type === 'G') {
          // 查詢是否有相同 coursePlan 的其他訂單
          const otherOrders = await this.ordersRepo.find({
            where: {
              coursePlan: { id: coursePlan.id },
            },
            relations: ['orderReservations', 'orderReservations.reservation'],
            order: { id: 'ASC' },
          });
          console.log('otherOrders', otherOrders);
          // 從其他訂單中取得已存在的 reservations（如果有的話）
          const existingOrderReservations = otherOrders
            .filter((order) => order.id !== savedOrder.id) // 排除當前訂單
            .flatMap((order) => order.orderReservations)
            .filter(
              (or, index, self) =>
                index ===
                self.findIndex((t) => t.reservationId === or.reservationId),
            ) // 去重
            .sort((a, b) => a.index - b.index);

          const existingReservations = existingOrderReservations.map(
            (or) => or.reservation,
          );

          console.log('existingReservations', existingReservations);
          const sessionCount = coursePlan.sessions?.length || 0;

          // 驗證 sessions 資料
          if (!coursePlan.sessions || sessionCount === 0) {
            throw new CustomException(
              'CoursePlan sessions not found or empty for group course',
              HttpStatus.BAD_REQUEST,
            );
          }

          // 情況 A: 已存在 reservations
          if (existingReservations.length > 0) {
            // 數量必須完全匹配
            if (existingReservations.length !== sessionCount) {
              throw new CustomException(
                `Existing reservations count (${existingReservations.length}) does not match sessions count (${sessionCount})`,
                HttpStatus.BAD_REQUEST,
              );
            }

            // 為每個現有的 reservation 創建 OrderReservation（如果尚未創建）
            // 注：此處假設已查詢到的 existingOrderReservations 可能不完整，需補充
            // 實際上如果邏輯正確，這裡應該已經有了，但為了保險起見，我們還是執行創建邏輯
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
              for (let i = 0; i < coursePlan.sessions.length; i++) {
                const session = coursePlan.sessions[i];
                const existingReservation = existingReservations[i];

                // 如果不存在，創建 OrderReservation
                const newOrderReservation = queryRunner.manager.create(
                  OrderReservation,
                  {
                    orderId: savedOrder.id,
                    reservationId: existingReservation.id,
                    index: session.no - 1,
                  },
                );
                await queryRunner.manager.save(newOrderReservation);
                console.log(
                  'Created new OrderReservation',
                  newOrderReservation,
                );
              }

              await queryRunner.commitTransaction();
            } catch (err) {
              await queryRunner.rollbackTransaction();
              throw err;
            } finally {
              await queryRunner.release();
            }
          }
          // 情況 B: 不存在 reservations，需要創建
          else {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
              // 為每個 session 創建 Reservation 和 OrderReservation
              for (const session of coursePlan.sessions) {
                // 1. 創建 Reservation
                const newReservation = queryRunner.manager.create(Reservation, {
                  reservationStatus: 1, // SCHEDULED
                  classTime: session.startTime,
                  teachingLevel: teachingLevel as any,
                  instructor: null,
                  department: department,
                  createdUser: memberId,
                  updatedUser: memberId,
                });
                const savedReservation =
                  await queryRunner.manager.save(newReservation);

                // 2. 創建 OrderReservation
                const newOrderReservation = queryRunner.manager.create(
                  OrderReservation,
                  {
                    orderId: savedOrder.id,
                    reservationId: savedReservation.id,
                    index: session.no - 1,
                  },
                );
                await queryRunner.manager.save(newOrderReservation);

                // 注意: 不創建 ReservationMember（與個人練習不同）
              }

              await queryRunner.commitTransaction();
            } catch (err) {
              await queryRunner.rollbackTransaction();
              throw err;
            } finally {
              await queryRunner.release();
            }
          }
        }

        // 創建交易資料並等待完成
        await this.transactionsService.createTransaction(savedOrder);
      }

      // 重新查詢訂單以包含 transaction 關聯
      const orderWithTransaction = await this.ordersRepo.findOne({
        where: { id: savedOrder.id },
        relations: ['transaction'],
      });

      // 將 depositAmt 加入訂單物件頂層以供 DTO 使用
      return {
        ...orderWithTransaction,
        depositAmt: orderWithTransaction.transaction?.depositAmt,
      } as any;

    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 獲取訂單相關的預約列表
  // 關聯邏輯: Order -> OrderReservation -> Reservation + ReservationMember
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

      // 查詢該訂單的所有 order-reservations
      const orderReservations = await this.orderReservationsRepo.find({
        where: { orderId },
        relations: [
          'reservation',
          'reservation.reservationMembers',
          'reservation.reservationMembers.orderMember',
          'reservation.reservationMembers.orderMember.member',
        ],
        order: { index: 'ASC' },
      });

      return orderReservations;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
