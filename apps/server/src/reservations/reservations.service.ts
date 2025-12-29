import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Or,
  ILike,
  DataSource,
  In,
  LessThanOrEqual,
} from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SkiAndSnowboardLevelEnum, CourseType } from '@repo/shared';
import { Reservation } from './entities/reservation.entity';
import { Department } from 'src/departments/entities/department.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Member } from 'src/members/entities/member.entity';
import { CoursePlanSession } from 'src/course-plan-session/entities/course-plan-session.entity';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { Course } from 'src/course/entities/course.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { ReservationStatus } from './entities/reservation.entity';
import { ReservationHistoryService } from 'src/reservation-history/reservation-history.service';
import { OrdersService } from 'src/orders/orders.service';
import {
  CreateReservationRequestDto,
  CreateReservationResponseDTO,
  UpdateReservationRequestDto,
  GetReservationsRequestDto,
  GetReservationDetailResponseDto,
  GetLinkedOrdersResponseDto,
  ReservationResponseDto,
  ResWithPaginationDTO,
} from '@repo/shared';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
    @InjectRepository(OrderReservation)
    private readonly orderReservationsRepo: Repository<OrderReservation>,
    @InjectRepository(ReservationMember)
    private readonly reservationMembersRepo: Repository<ReservationMember>,
    @InjectRepository(OrderMember)
    private readonly orderMembersRepo: Repository<OrderMember>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Member)
    private readonly membersRepo: Repository<Member>,
    @InjectRepository(CoursePlanSession)
    private readonly coursePlanSessionRepo: Repository<CoursePlanSession>,
    private readonly dataSource: DataSource,
    private readonly reservationHistoryService: ReservationHistoryService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  // 獲取預約列表
  async getReservations(
    request: GetReservationsRequestDto,
  ): Promise<ResWithPaginationDTO<any[]>> {
    try {
      // 使用 QueryBuilder 構建複雜查詢
      const queryBuilder = this.reservationsRepo
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.department', 'department')
        .leftJoinAndSelect('reservation.reservationMembers', 'reservationMembers')
        .leftJoinAndSelect('reservationMembers.orderMember', 'orderMember')
        .leftJoinAndSelect('orderMember.member', 'member')
        .leftJoinAndSelect('orderMember.order', 'memberOrder')
        .leftJoinAndSelect('memberOrder.coursePlan', 'memberCoursePlan')
        .leftJoinAndSelect('memberCoursePlan.course', 'memberCourse')
        .leftJoinAndSelect('memberCourse.coursePeople', 'memberCoursePeople')
        .leftJoinAndSelect('reservation.orderReservations', 'orderReservations')
        .leftJoinAndSelect('orderReservations.order', 'order')
        .leftJoinAndSelect('order.coursePlan', 'coursePlan')
        .leftJoinAndSelect('coursePlan.course', 'course')
        .leftJoinAndSelect('course.coursePeople', 'coursePeople');

      // 篩選：部門ID
      if (request.departmentId) {
        queryBuilder.andWhere('department.id = :departmentId', {
          departmentId: request.departmentId,
        });
      }

      // 篩選：預約狀態
      if (
        request.reservationStatus !== undefined &&
        request.reservationStatus !== null
      ) {
        queryBuilder.andWhere('reservation.reservationStatus = :reservationStatus', {
          reservationStatus: request.reservationStatus,
        });
      }

      // 篩選：課程類型（從 Order 表）
      if (request.courseType) {
        queryBuilder.andWhere('order.type = :courseType', {
          courseType: request.courseType,
        });
      }

      // 篩選：板類（從 Order 表）
      if (request.skiType !== undefined && request.skiType !== null) {
        queryBuilder.andWhere('order.skiType = :skiType', {
          skiType: request.skiType,
        });
      }

      // 篩選：等級
      if (request.teachingLevel) {
        const levels = Array.isArray(request.teachingLevel)
          ? request.teachingLevel
          : [request.teachingLevel];

        const conditions = levels.map(level => {
          if (level === '7+') {
            // 處理「7以上」的情況
            return 'CAST(reservation.teachingLevel AS INTEGER) >= 7';
          } else {
            return `reservation.teachingLevel = '${level}'`;
          }
        });

        if (conditions.length > 0) {
          queryBuilder.andWhere(`(${conditions.join(' OR ')})`);
        }
      }

      // 篩選：教練（支援複選）
      if (request.instructor) {
        const instructors = Array.isArray(request.instructor)
          ? request.instructor
          : [request.instructor];

        const instructorConditions = instructors.map(
          (instructor) => `reservation.instructor = '${instructor}'`
        );

        if (instructorConditions.length > 0) {
          queryBuilder.andWhere(`(${instructorConditions.join(' OR ')})`);
        }
      }

      // 篩選：上課時間範圍（起始）
      if (request.classTimeStart) {
        queryBuilder.andWhere('reservation.classTime >= :classTimeStart', {
          classTimeStart: request.classTimeStart,
        });
      }

      // 篩選：上課時間範圍（結束）
      if (request.classTimeEnd) {
        queryBuilder.andWhere('reservation.classTime <= :classTimeEnd', {
          classTimeEnd: request.classTimeEnd,
        });
      }

      // 篩選：關鍵字（預約編號或教練名稱）
      if (request.keyword) {
        queryBuilder.andWhere(
          '(CAST(reservation.reservationNo AS TEXT) ILIKE :keyword OR reservation.instructor ILIKE :keyword)',
          { keyword: `%${request.keyword}%` },
        );
      }

      // 分頁參數
      const customPage =
        isNaN(Number(request.page)) || request.page <= 0
          ? 1
          : Number(request.page);
      const customLimit =
        isNaN(Number(request.limit)) || request.limit <= 0
          ? 10
          : Number(request.limit);

      // 獲取總數（在篩選之後）
      const total = await queryBuilder.getCount();

      // 應用分頁和排序
      queryBuilder
        .orderBy('reservation.createdTime', 'DESC')
        .skip((customPage - 1) * customLimit)
        .take(customLimit);

      const reservations = await queryBuilder.getMany();

      // 為每個預約加入課程名稱、板類、最大人數和剩餘名額
      const reservationsWithCourseName = reservations.map((reservation) => {
        // 優先從 orderReservations 獲取課程資訊（不依賴預約成員）
        let order = reservation.orderReservations?.[0]?.order;
        let coursePlan = order?.coursePlan;
        let course = coursePlan?.course;
        let coursePeople = course?.coursePeople?.[0];

        // 如果 orderReservations 沒有資料，才從 reservationMembers 獲取（向後兼容）
        if (!order) {
          const firstOrderMember =
            reservation.reservationMembers?.[0]?.orderMember;
          order = firstOrderMember?.order;
          coursePlan = order?.coursePlan;
          course = coursePlan?.course;
          coursePeople = course?.coursePeople?.[0];
        }

        const courseName = course?.name || '';
        const skiType = order?.skiType;
        const maxStudentCount = coursePeople?.maxPeople || 0;
        const currentMembers = reservation.reservationMembers?.length || 0;
        const remainingSlots = maxStudentCount > 0 ? maxStudentCount - currentMembers : 0;

        return {
          ...reservation,
          courseName,
          skiType,
          maxStudentCount,
          currentMembers,
          remainingSlots,
        };
      });

      // 篩選：剩餘名額（後處理，因為是計算欄位）
      let filteredReservations = reservationsWithCourseName;
      if (request.remainingSlots !== undefined && request.remainingSlots !== null) {
        filteredReservations = reservationsWithCourseName.filter(
          (r) => r.remainingSlots >= request.remainingSlots,
        );
      }

      return {
        data: filteredReservations,
        total: request.remainingSlots !== undefined && request.remainingSlots !== null
          ? filteredReservations.length
          : total,
        page: customPage,
        limit: customLimit,
        pages: Math.ceil(
          (request.remainingSlots !== undefined && request.remainingSlots !== null
            ? filteredReservations.length
            : total) / customLimit
        ),
      };
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // 根據ID獲取預約詳情
  async getReservationDetail(
    id: string,
  ): Promise<GetReservationDetailResponseDto> {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: [
          'reservationMembers',
          'reservationMembers.orderMember',
          'reservationMembers.orderMember.member',
          'reservationMembers.orderMember.order',
          'reservationMembers.orderMember.order.coursePlan.course.coursePeople',
        ],
      });

      if (!reservation) {
        throw new CustomException(
          `Reservation with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // 獲取連結的訂單資訊
      const orderReservations = await this.orderReservationsRepo.find({
        where: { reservationId: id },
        relations: [
          'order',
          'order.coursePlan',
          'order.coursePlan.course',
          'order.coursePlan.course.coursePeople',
        ],
        order: { index: 'ASC' },
      });

      const linkedOrders = orderReservations.map((or) => ({
        orderId: or.orderId,
        orderNo: or.order?.no || '',
        index: or.index,
        orderReservationId: or.id,
      }));

      // 格式化 reservationMembers
      const reservationMembers: GetReservationDetailResponseDto['reservationMembers'] =
        reservation.reservationMembers?.map((rm) => ({
          id: rm.id,
          reservationId: rm.reservationId,
          orderMemberId: rm.orderMemberId,
          note: rm.note || undefined,
          attended: rm.attended,
          orderMember: rm.orderMember
            ? {
                id: rm.orderMember.id,
                orderId: rm.orderMember.orderId,
                memberId: rm.orderMember.memberId,
                member: {
                  id: rm.orderMember.member.id,
                  name: rm.orderMember.member.name,
                  phone: rm.orderMember.member.phone,
                  email: rm.orderMember.member.email,
                  birthday: rm.orderMember.member.birthday,
                  avatar: rm.orderMember.member.avatar,
                  skis: rm.orderMember.member.skis,
                  snowboard: rm.orderMember.member.snowboard,
                },
                order: {
                  id: rm.orderMember.order.id,
                  no: rm.orderMember.order.no,
                  status: String(rm.orderMember.order.status),
                  skiType: rm.orderMember.order.skiType,
                  planNumber: rm.orderMember.order.planNumber,
                },
              }
            : undefined,
        }));

      // Get course information from orderReservations instead of reservationMembers
      const firstOrder = orderReservations[0]?.order;
      const coursePlan = firstOrder?.coursePlan;
      const course = coursePlan?.course;
      const coursePeople = course?.coursePeople?.[0];

      const maxStudentCount = coursePeople?.maxPeople;
      const minStudentCount = coursePeople?.minPeople;
      const courseType = firstOrder?.type;
      const skiType = firstOrder?.skiType;

      const reservationDetail: GetReservationDetailResponseDto = {
        id: reservation.id,
        reservationNo: reservation.reservationNo,
        reservationStatus: reservation.reservationStatus,
        classTime: reservation.classTime,
        teachingLevel: reservation.teachingLevel,
        instructor: reservation.instructor,
        isDesignatedCoach: reservation.isDesignatedCoach,
        departmentName: reservation.department?.name || '',
        createdTime: reservation.createdTime,
        updatedTime: reservation.updatedTime,
        linkedOrders: linkedOrders.length > 0 ? linkedOrders : undefined,
        reservationMembers: reservationMembers,
        minStudentCount,
        maxStudentCount,
        courseType,
        skiType,
      };

      return reservationDetail;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 創建預約
  async createReservation(body: CreateReservationRequestDto, userId?: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 驗證 department
      const department = await this.departmentsRepo.findOne({
        where: { id: body.departmentId },
      });
      if (!department) {
        throw new CustomException(
          `departmentId: ${body.departmentId} is not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 驗證 orderId
      const order = await this.ordersRepo.findOne({
        where: { id: body.orderId },
      });
      if (!order) {
        throw new CustomException(
          `orderId: ${body.orderId} is not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate that order hasn't expired
      if (order.expDate && new Date() > order.expDate) {
        throw new CustomException(
          `Cannot add reservation: Order has expired on ${order.expDate.toLocaleDateString()}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 驗證預約數量是否超過訂單課程數量
      const allOrderReservationsForValidation = await this.orderReservationsRepo.find({
        where: { orderId: body.orderId },
        relations: ['reservation'],
      });

      // 計算 active 預約數量 (排除 CANCELED 狀態)
      const activeReservationCount = allOrderReservationsForValidation.filter(
        (or) => or.reservation && or.reservation.reservationStatus !== ReservationStatus.CANCELED
      ).length;

      // 如果已達課程數量上限，拒絕創建新預約
      if (activeReservationCount >= order.planNumber) {
        throw new CustomException(
          `預約數量已達上限。此訂單最多可預約 ${order.planNumber} 堂課程，目前已有 ${activeReservationCount} 個有效預約。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 驗證所有 orderMemberIds 存在且屬於該訂單
      const orderMembers = await this.orderMembersRepo.find({
        where: { id: In(body.orderMemberIds) },
      });

      if (orderMembers.length !== body.orderMemberIds.length) {
        throw new CustomException(
          'Some orderMemberIds are not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 確認所有 orderMembers 都屬於該訂單
      const invalidMembers = orderMembers.filter(
        (om) => om.orderId !== body.orderId,
      );
      if (invalidMembers.length > 0) {
        throw new CustomException(
          'Some orderMembers do not belong to the specified order',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 計算 teachingLevel（如果未提供的話）
      let teachingLevel = body.teachingLevel;
      if (!teachingLevel) {
        // 從 orderMembers 中獲取 memberIds
        const memberIds = orderMembers.map(om => om.memberId);
        // 使用訂單的 skiType 來計算
        teachingLevel = await this.calculateTeachingLevel(
          memberIds,
          order.skiType,
        ) as SkiAndSnowboardLevelEnum;
      }

      // 1. 創建 Reservation
      const newReservation = queryRunner.manager.create(Reservation, {
        reservationStatus:
          body.reservationStatus || ReservationStatus.SCHEDULED,
        classTime: body.classTime,
        teachingLevel: teachingLevel,
        instructor: body.instructor || null,
        isDesignatedCoach: body.isDesignatedCoach || false,
        createdUser: userId,
        updatedUser: userId,
        department: department,
      });

      const savedReservation = await queryRunner.manager.save(newReservation);

      // 2. 創建 ReservationMember 記錄
      const reservationMembers = body.orderMemberIds.map((orderMemberId) => {
        return queryRunner.manager.create(ReservationMember, {
          reservationId: savedReservation.id,
          orderMemberId,
        });
      });

      await queryRunner.manager.save(reservationMembers);

      // 3. 處理 index 並創建 OrderReservation
      let targetIndex: number;

      if (body.index !== undefined && body.index !== null) {
        // Admin 指定了 index - 需要驗證該 index 是否可用
        targetIndex = body.index;

        // 查詢該 index 是否存在 active reservation
        const existingOrderReservations = await queryRunner.manager.find(
          OrderReservation,
          {
            where: {
              orderId: body.orderId,
              index: targetIndex,
            },
            relations: ['reservation'],
          },
        );

        // 檢查是否有 active (非取消) 的預約佔用此 index
        const hasActiveReservation = existingOrderReservations.some(
          or => or.reservation && or.reservation.reservationStatus !== ReservationStatus.CANCELED
        );

        if (hasActiveReservation) {
          throw new CustomException(
            `Index ${targetIndex} is already occupied by an active reservation`,
            HttpStatus.CONFLICT,
          );
        }

        // 如果 index 已被取消的預約佔用，可以重用該 index 創建新記錄
        // 如果 index 為空，也可以使用
      } else {
        // Client 未指定 index - 自動分配下一個可用 index
        // 查詢所有 OrderReservations with their reservation status
        const allOrderReservations = await queryRunner.manager.find(
          OrderReservation,
          {
            where: { orderId: body.orderId },
            relations: ['reservation'],
            order: { index: 'ASC' },
          },
        );

        // 找出所有 active (非取消) 預約佔用的 indices
        const occupiedIndices = new Set<number>();
        allOrderReservations.forEach(or => {
          if (or.reservation && or.reservation.reservationStatus !== ReservationStatus.CANCELED) {
            occupiedIndices.add(or.index);
          }
        });

        // 找出第一個未被 active 預約佔用的 index
        targetIndex = 0;
        while (occupiedIndices.has(targetIndex)) {
          targetIndex++;
        }
      }

      const newOrderReservation = queryRunner.manager.create(OrderReservation, {
        orderId: body.orderId,
        reservationId: savedReservation.id,
        index: targetIndex,
      });

      await queryRunner.manager.save(newOrderReservation);

      // Recalculate order's expDate since a new reservation was added
      await this.ordersService.calculateAndUpdateOrderExpDate(
        body.orderId,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return savedReservation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  // 更新預約
  async updateReservation(
    id: string,
    body: UpdateReservationRequestDto,
    userId?: string,
    userType?: string,
  ) {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: ['reservationMembers', 'reservationMembers.orderMember', 'reservationMembers.orderMember.member'],
      });

      if (!reservation) {
        throw new CustomException(
          `Reservation with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // 驗證 member 權限：只有預約參與者才能修改
      // 檢查該 member 是否為此預約的參與者
      if (userType != "admin" && userId) {
        const isMemberOfReservation = reservation.reservationMembers?.some(
          (rm) => rm.orderMember?.memberId === userId,
        );

        if (!isMemberOfReservation) {
          throw new CustomException(
            'You do not have permission to modify this reservation',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      // 驗證預約狀態：只有已排定的預約可以修改
      if (reservation.reservationStatus !== ReservationStatus.SCHEDULED) {
        throw new CustomException(
          `只有已排定的預約可以修改。目前狀態：${reservation.reservationStatus === ReservationStatus.PENDING_REVIEW ? '待紀錄' : reservation.reservationStatus === ReservationStatus.COMPLETED ? '已完成' : '已取消'}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 如果有提供 departmentId，驗證部門
      if (body.departmentId) {
        const department = await this.departmentsRepo.findOne({
          where: { id: body.departmentId },
        });

        if (!department) {
          throw new CustomException(
            `Department with id: ${body.departmentId} not found`,
            HttpStatus.NOT_FOUND,
          );
        }

        reservation.department = department;
      }

      // 檢測時間是否有變更
      let hasTimeChanged = false;
      if (body.classTime !== undefined) {
        const oldTime = reservation.classTime
          ? new Date(reservation.classTime).getTime()
          : null;
        const newTime = new Date(body.classTime).getTime();
        hasTimeChanged = oldTime !== newTime;
      }

      // 更新預約資料（只更新有提供的欄位）
      if (body.classTime !== undefined) {
        reservation.classTime = body.classTime;
      }
      if (body.teachingLevel !== undefined) {
        reservation.teachingLevel = body.teachingLevel;
      }
      if (body.instructor !== undefined) {
        reservation.instructor = body.instructor;
      }
      if (body.isDesignatedCoach !== undefined) {
        reservation.isDesignatedCoach = body.isDesignatedCoach;
      }
      if (body.reservationStatus !== undefined) {
        reservation.reservationStatus =
          body.reservationStatus as ReservationStatus;
      }
      reservation.updatedUser = userId;

      const savedReservation = await this.reservationsRepo.save(reservation);

      // 如果時間有變更，寫入 history
      if (hasTimeChanged) {
        // 查詢操作者名稱
        let operatorName = '';
        if (userId) {
          const user = await this.usersRepo.findOne({ where: { id: userId } });
          operatorName = user?.name || userId;
        }

        await this.reservationHistoryService.create({
          reservationId: id,
          event: '預約改期',
          operator: operatorName,
          reason: body.reason || '',
        });
      }

      return savedReservation;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 更新預約狀態
  async updateReservationStatus(
    id: string,
    status: ReservationStatus,
    userId?: string,
  ) {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id },
      });

      if (!reservation) {
        throw new CustomException(
          `Reservation with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      reservation.reservationStatus = status;
      reservation.updatedUser = userId;

      return await this.reservationsRepo.save(reservation);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 取消預約
  async cancelReservation(
    id: string,
    reason: string,
    userId?: string,
  ): Promise<Reservation> {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: ['reservationMembers', 'reservationMembers.orderMember', 'reservationMembers.orderMember.member', 'reservationMembers.orderMember.order'],
      });

      if (!reservation) {
        throw new CustomException(
          `Reservation with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // 驗證 member 權限：只有訂單的參與者（order members）才能取消預約
      if (userId) {
        console.log('Checking permission for userId:', userId);
        console.log('Reservation members:', reservation.reservationMembers?.map(rm => ({
          id: rm.id,
          orderMemberId: rm.orderMemberId,
          orderMember: rm.orderMember ? {
            id: rm.orderMember.id,
            memberId: rm.orderMember.memberId,
            active: rm.orderMember.active,
            orderId: rm.orderMember.orderId
          } : null
        })));

        // 檢查該 member 是否為此預約關聯訂單的參與者
        const isMemberOfReservation = reservation.reservationMembers?.some(
          (rm) => {
            // 確保 orderMember 存在且有 memberId
            if (!rm.orderMember) {
              console.warn(`ReservationMember ${rm.id} has no orderMember loaded`);
              return false;
            }
            // 檢查 memberId 是否匹配
            const matches = rm.orderMember.memberId === userId;
            console.log(`Checking rm ${rm.id}: orderMember.memberId=${rm.orderMember.memberId}, userId=${userId}, matches=${matches}`);
            return matches;
          }
        );

        console.log('isMemberOfReservation:', isMemberOfReservation);

        if (!isMemberOfReservation) {
          throw new CustomException(
            'You do not have permission to cancel this reservation',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      // 驗證預約狀態是否為 SCHEDULED（只有排程中的可以取消）
      if (reservation.reservationStatus !== ReservationStatus.SCHEDULED) {
        throw new CustomException(
          `Only scheduled reservations can be canceled. Current status: ${reservation.reservationStatus}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 更新狀態為 CANCELED
      reservation.reservationStatus = ReservationStatus.CANCELED;
      reservation.updatedUser = userId;

      const savedReservation = await this.reservationsRepo.save(reservation);

      // Recalculate expDate for all orders affected by this cancellation
      // Get unique order IDs from reservation members
      const uniqueOrderIds = [
        ...new Set(
          savedReservation.reservationMembers
            ?.map((rm) => rm.orderMember?.orderId)
            .filter((id) => id) || [],
        ),
      ];

      // Recalculate expDate for each affected order
      for (const orderId of uniqueOrderIds) {
        await this.ordersService.calculateAndUpdateOrderExpDate(orderId);
      }

      // 查詢操作者名稱
      let operatorName = '';
      if (userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        operatorName = user?.name || userId;
      }

      // 創建 ReservationHistory 記錄
      await this.reservationHistoryService.create({
        reservationId: id,
        event: '取消預約',
        operator: operatorName,
        reason: reason,
      });

      return savedReservation;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 獲取連結此預約的訂單詳細資訊
  async getLinkedOrders(reservationId: string) {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new CustomException(
          `Reservation with id: ${reservationId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const orderReservations = await this.orderReservationsRepo.find({
        where: { reservationId },
        relations: ['order'],
        order: { index: 'ASC' },
      });

      const linkedOrders = orderReservations.map((or) => ({
        orderId: or.orderId,
        orderNo: or.order?.no || '',
        index: or.index,
        orderReservationId: or.id,
      }));

      return {
        reservationId,
        linkedOrders,
      };
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 每 10 分鐘檢查是否有課程已結束需要更新狀態
   * 將 SCHEDULED (1) 更新為 PENDING_REVIEW (2)
   */
  // @Cron('*/10 * * * *')
  @Cron(CronExpression.EVERY_MINUTE)
  async updateExpiredReservationStatuses() {
    try {
      // 查找所有 classTime 已過且狀態仍為 SCHEDULED 的預約
      const expiredReservations = await this.reservationsRepo.find({
        where: {
          classTime: LessThanOrEqual(new Date()),
          reservationStatus: ReservationStatus.SCHEDULED,
        },
      });

      if (expiredReservations.length === 0) {
        return;
      }

      // 更新狀態為 PENDING_REVIEW
      const updatedReservations = expiredReservations.map((reservation) => ({
        ...reservation,
        reservationStatus: ReservationStatus.PENDING_REVIEW,
      }));

      // 保存到資料庫
      await this.reservationsRepo.save(updatedReservations);

      console.log(
        `[CRON] Updated ${updatedReservations.length} reservations from SCHEDULED to PENDING_REVIEW`,
      );

      return updatedReservations;
    } catch (err) {
      console.error('[CRON] Error updating reservation statuses:', err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 獲取預約時段 - 基於 reservation 表
  async getReservationSlots(query: any): Promise<any> {
    try {
      const { branch_id, start_date, end_date, course_type } = query;

      // 驗證必要參數
      if (!branch_id || !start_date || !end_date) {
        throw new HttpException(
          `Missing required parameters. Got: branch_id=${branch_id}, start_date=${start_date}, end_date=${end_date}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 轉換日期：start_date 應該從當天 00:00:00 開始，end_date 應該到當天 23:59:59
      let startDateTime: Date;
      let endDateTime: Date;

      try {
        startDateTime = new Date(start_date);
        if (isNaN(startDateTime.getTime())) {
          throw new Error(`Invalid start_date: ${start_date}`);
        }
        startDateTime.setHours(0, 0, 0, 0);

        endDateTime = new Date(end_date);
        if (isNaN(endDateTime.getTime())) {
          throw new Error(`Invalid end_date: ${end_date}`);
        }
        endDateTime.setHours(23, 59, 59, 999);
      } catch (dateErr) {
        throw new HttpException(`Invalid date format: ${dateErr.message}`, HttpStatus.BAD_REQUEST);
      }


      // 基本查詢：從 reservation 表取得指定分店和時間範圍內的預約
      const reservationsQuery = this.reservationsRepo
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.department', 'department')
        .leftJoinAndSelect('reservation.orderReservations', 'orderReservation')
        .leftJoinAndSelect('orderReservation.order', 'order')
        .leftJoinAndSelect('order.member', 'member')
        .leftJoinAndSelect('order.transaction', 'transaction')
        .leftJoinAndSelect('order.coursePlan', 'coursePlan')
        .leftJoinAndSelect('coursePlan.course', 'course')
        .leftJoinAndSelect('course.coursePeople', 'coursePeople')
        .where('department.id = :branch_id', { branch_id })
        .andWhere('reservation.classTime >= :start_date', { start_date: startDateTime })
        .andWhere('reservation.classTime <= :end_date', { end_date: endDateTime })
        .andWhere('reservation.reservationStatus != :cancelStatus', {
          cancelStatus: ReservationStatus.CANCELED,
        });

      // 根據課程類型篩選
      if (course_type !== undefined) {
        reservationsQuery.andWhere('course.type = :course_type', { course_type });
      }

      const reservations = await reservationsQuery.getMany();

      // 建立 slots 陣列 - 每個預約對應一個 slot（不聚合）
      const slots = [];

      for (const reservation of reservations) {
        const classTimeStr = new Date(reservation.classTime).toISOString();
        const order = reservation.orderReservations?.[0]?.order;
        const course = order?.coursePlan?.course;
        const courseName = course?.name || '未知課程';
        const courseType = course?.type;
        const coursePeople = course?.coursePeople?.[0];
        const maxCapacity = coursePeople?.maxPeople || 0;
        const courseLength = course?.length || 90;

        // 取得訂購人和交易資訊
        const ordererName = order?.member?.name || '未知';
        const transactionStatus = order?.transaction?.status ?? null;

        // 取得板類和等級資訊
        const skiType = order?.skiType;
        const boardType = skiType === 1 ? '單板' : skiType === 2 ? '雙板' : '單板和雙板';
        const teachingLevel = reservation.teachingLevel;
        const level = teachingLevel ? parseInt(teachingLevel, 10) : null;

        // 計算同時間同課程的總預約數（用於判斷併班）
        const sameTimeAndCourse = reservations.filter(r => {
          const rTime = new Date(r.classTime).toISOString();
          const rCourse = r.orderReservations?.[0]?.order?.coursePlan?.course;
          return rTime === classTimeStr && rCourse?.id === course?.id;
        });
        const currentBookedCount = sameTimeAndCourse.length;
        const isMixed = courseType === CourseType.GROUP && currentBookedCount > 1;

        slots.push({
          id: `slot-${reservation.id}`,
          startTime: reservation.classTime,
          endTime: new Date(new Date(reservation.classTime).getTime() + courseLength * 60 * 1000),
          courseName,
          courseType,
          ordererName,
          transactionStatus,
          maxCapacity,
          currentBookedCount,
          instructorName: reservation.instructor || '未指定',
          departmentName: reservation.department?.name,
          venueName: order?.coursePlan?.name,
          status: 'available',
          isMixed,
          reservationId: reservation.id,
          boardType,
          level,
        });
      }

      // 為每個 slot 計算最終狀態
      slots.forEach((slot) => {
        const now = new Date();
        if (slot.startTime < now) {
          // 過去的課程
          slot.status = 'closed';
        } else if (slot.currentBookedCount >= slot.maxCapacity && slot.maxCapacity > 0) {
          // 已額滿
          slot.status = 'full';
        } else {
          // 有空位
          slot.status = 'available';
        }
      });

      return {
        slots,
        totalCount: slots.length,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 計算教學等級
   * 如果前台沒有提供課程等級，則使用所有成員中的最小等級 + 1
   * @param memberIds - 成員 ID 列表
   * @param skiType - 滑板類型 (0: BOTH, 1: 單板, 2: 雙板)
   * @returns 教學等級字符串
   */
  private async calculateTeachingLevel(
    memberIds: string[],
    skiType: number,
  ): Promise<string> {
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
      console.log('Reservation calculateTeachingLevel - minLevel:', minLevel, 'levels:', levels);
      const calculatedLevel = Math.min(minLevel + 1, 20);

      return calculatedLevel.toString();
    } catch (error) {
      console.error('Error calculating teaching level in reservations:', error);
      return '-';
    }
  }
}
