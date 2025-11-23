import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Or,
  ILike,
  DataSource,
  In,
  LessThanOrEqual,
} from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { SkiAndSnowboardLevelEnum, CourseType } from '@repo/shared';
import { Reservation } from './entities/reservation.entity';
import { Department } from 'src/departments/entities/department.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { CoursePlanSession } from 'src/course-plan-session/entities/course-plan-session.entity';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { Course } from 'src/course/entities/course.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { ReservationStatus } from './entities/reservation.entity';
import { ReservationHistoryService } from 'src/reservation-history/reservation-history.service';
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
    @InjectRepository(CoursePlanSession)
    private readonly coursePlanSessionRepo: Repository<CoursePlanSession>,
    private readonly dataSource: DataSource,
    private readonly reservationHistoryService: ReservationHistoryService,
  ) {}

  // 獲取預約列表
  async getReservations(
    request: GetReservationsRequestDto,
  ): Promise<ResWithPaginationDTO<any[]>> {
    try {
      // 構建查詢條件
      let where: any = {};

      // 根據部門ID篩選
      if (request.departmentId) {
        where.department = { id: request.departmentId };
      }

      // 根據課程狀態篩選
      if (
        request.reservationStatus !== undefined &&
        request.reservationStatus !== null
      ) {
        where.reservationStatus = request.reservationStatus;
      }

      // 根據關鍵字搜索預約編號或指定教練
      if (request.keyword) {
        const keywordConditions = [
          { ...where, reservationNo: ILike(`%${request.keyword}%`) },
          { ...where, instructor: ILike(`%${request.keyword}%`) },
        ];
        where = Or(...keywordConditions);
      }

      const customPage =
        isNaN(Number(request.page)) || request.page <= 0
          ? 1
          : Number(request.page);
      const customLimit =
        isNaN(Number(request.limit)) || request.limit <= 0
          ? 10
          : Number(request.limit);

      // 使用 find() 方法
      const [reservations, total] = await this.reservationsRepo.findAndCount({
        where,
        relations: [
          'reservationMembers',
          'reservationMembers.orderMember',
          'reservationMembers.orderMember.member',
          'reservationMembers.orderMember.order',
          'reservationMembers.orderMember.order.coursePlan',
          'reservationMembers.orderMember.order.coursePlan.course',
          'reservationMembers.orderMember.order.coursePlan.course.coursePeople',
        ],
        order: {
          createdTime: 'DESC',
        },
        skip: (customPage - 1) * customLimit,
        take: customLimit,
      });

      // 為每個預約加入課程名稱、板類和最大人數
      const reservationsWithCourseName = reservations.map((reservation) => {
        const firstOrderMember =
          reservation.reservationMembers?.[0]?.orderMember;
        const order = firstOrderMember?.order;
        const coursePlan = order?.coursePlan;
        const course = coursePlan?.course;
        const coursePeople = course?.coursePeople?.[0];

        const courseName = course?.name || '';
        const skiType = order?.skiType;
        const maxStudentCount = coursePeople?.maxPeople;

        return {
          ...reservation,
          courseName,
          skiType,
          maxStudentCount,
        };
      });

      return {
        data: reservationsWithCourseName,
        total,
        page: customPage,
        limit: customLimit,
        pages: Math.ceil(total / customLimit),
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
          orderMember: rm.orderMember
            ? {
                id: rm.orderMember.id,
                orderId: rm.orderMember.orderId,
                memberId: rm.orderMember.memberId,
                member: {
                  id: rm.orderMember.member.id,
                  name: rm.orderMember.member.name,
                  phone: rm.orderMember.member.phone,
                  birthday: rm.orderMember.member.birthday,
                  avatar: rm.orderMember.member.avatar,
                  skis: rm.orderMember.member.skis,
                  snowboard: rm.orderMember.member.snowboard,
                },
                order: {
                  id: rm.orderMember.order.id,
                  no: rm.orderMember.order.no,
                  status: String(rm.orderMember.order.status),
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

      // 1. 創建 Reservation
      const newReservation = queryRunner.manager.create(Reservation, {
        reservationStatus:
          body.reservationStatus || ReservationStatus.SCHEDULED,
        classTime: body.classTime,
        teachingLevel: body.teachingLevel,
        instructor: body.instructor || null,
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

      // 3. 計算 index 並創建 OrderReservation
      const existingOrderReservations = await queryRunner.manager.find(
        OrderReservation,
        {
          where: { orderId: body.orderId },
          order: { index: 'DESC' },
        },
      );

      const nextIndex =
        existingOrderReservations.length > 0
          ? existingOrderReservations[0].index + 1
          : 0;

      const newOrderReservation = queryRunner.manager.create(OrderReservation, {
        orderId: body.orderId,
        reservationId: savedReservation.id,
        index: nextIndex,
      });

      await queryRunner.manager.save(newOrderReservation);

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
  @Cron('*/10 * * * *')
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

  // 獲取預約時段 - 簡化版本用於測試
  async getReservationSlots(query: any): Promise<any> {
    try {
      const { branch_id, start_date, end_date, course_type } = query;

      // 基本查詢：取得指定分店和時間範圍內的課程計劃時段
      const sessionsQuery = this.coursePlanSessionRepo
        .createQueryBuilder('session')
        .leftJoinAndSelect('session.plan', 'plan')
        .leftJoinAndSelect('plan.course', 'course')
        .leftJoinAndSelect('course.department', 'department')
        .leftJoinAndSelect('course.coursePeople', 'coursePeople')
        .where('department.id = :branch_id', { branch_id })
        .andWhere('session.startTime >= :start_date', { start_date })
        .andWhere('session.startTime <= :end_date', { end_date });

      // 根據課程類型篩選
      if (course_type !== undefined) {
        sessionsQuery.andWhere('course.type = :course_type', { course_type });
      }

      const sessions = await sessionsQuery.getMany();
      const slots = [];

      for (const session of sessions) {
        // 查找與此 session 相關的預約數量
        const reservationCount = await this.reservationsRepo
          .createQueryBuilder('reservation')
          .leftJoin('reservation.orderReservations', 'or')
          .leftJoin('or.order', 'order')
          .leftJoin('order.coursePlan', 'coursePlan')
          .leftJoin('coursePlan.sessions', 'coursePlanSession')
          .where('coursePlanSession.id = :sessionId', { sessionId: session.id })
          .andWhere('reservation.reservationStatus != :cancelStatus', {
            cancelStatus: ReservationStatus.CANCELED,
          })
          .getCount();

        // 取得課程容量
        const coursePeople = session.plan?.course?.coursePeople?.[0];
        const maxCapacity = coursePeople?.maxPeople || 0;

        // 判斷時段狀態
        let status = 'available';
        const now = new Date();

        if (session.startTime < now) {
          status = 'closed';
        } else if (reservationCount >= maxCapacity && maxCapacity > 0) {
          status = 'full';
        }

        // 檢查是否併班 (團體課且有預約)
        const isMixed =
          session.plan?.course?.type === CourseType.GROUP &&
          reservationCount > 0;

        const slot = {
          id: session.id,
          startTime: session.startTime,
          endTime: session.endTime,
          courseName: session.plan?.course?.name || '未知課程',
          currentBookedCount: reservationCount,
          maxCapacity,
          status,
          courseType: session.plan?.course?.type,
          isMixed,
          departmentName: session.plan?.course?.department?.name,
          venueName: session.plan?.name,
        };

        slots.push(slot);
      }

      return {
        slots,
        totalCount: slots.length,
      };
    } catch (err) {
      console.error('Error in getReservationSlots:', err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
