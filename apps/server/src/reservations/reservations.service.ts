import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or, ILike, DataSource, In } from 'typeorm';
import { SkiAndSnowboardLevelEnum } from '@repo/shared';
import { Reservation } from './entities/reservation.entity';
import { Department } from 'src/departments/entities/department.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { Order } from 'src/orders/entities/order.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { ReservationStatus } from './entities/reservation.entity';
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
    private readonly dataSource: DataSource,
  ) {}

  // 獲取預約列表
  async getReservations(
    request: GetReservationsRequestDto,
  ): Promise<ResWithPaginationDTO<Reservation[]>> {
    try {
      // 構建查詢條件
      let where: any = {};
      
      // 根據部門ID篩選
      if (request.departmentId) {
        where.department = { id: request.departmentId };
      }

      // 根據課程狀態篩選
      if (request.reservationStatus !== undefined && request.reservationStatus !== null) {
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
        relations: ['reservationMembers', 'reservationMembers.orderMember', 'reservationMembers.orderMember.member', 'reservationMembers.orderMember.order','reservationMembers.orderMember.order.coursePlan','reservationMembers.orderMember.order.coursePlan.course','reservationMembers.orderMember.order.coursePlan.course.coursePeople'],
        order: {
          createdTime: 'DESC',
        },
        skip: (customPage - 1) * customLimit,
        take: customLimit,
      });

      return {
        data: reservations,
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
  async getReservationDetail(id: string): Promise<GetReservationDetailResponseDto> {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: [ 'reservationMembers', 'reservationMembers.orderMember', 'reservationMembers.orderMember.member', 'reservationMembers.orderMember.order','reservationMembers.orderMember.order.coursePlan.course.coursePeople'],
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
        relations: ['order'],
        order: { index: 'ASC' },
      });

      const linkedOrders = orderReservations.map(or => ({
        orderId: or.orderId,
        orderNo: or.order?.no || '',
        index: or.index,
        orderReservationId: or.id,
      }));

      // 格式化 reservationMembers
      const reservationMembers: GetReservationDetailResponseDto['reservationMembers'] = reservation.reservationMembers?.map(rm => ({
        id: rm.id,
        reservationId: rm.reservationId,
        orderMemberId: rm.orderMemberId,
        note: rm.note || undefined,
        orderMember: rm.orderMember ? {
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
        } : undefined,
      }));

      const maxStudentCount = reservation.reservationMembers[0].orderMember.order.coursePlan.course.coursePeople[0].maxPeople;

      const minStudentCount = reservation.reservationMembers[0].orderMember.order.coursePlan.course.coursePeople[0].minPeople;
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
        minStudentCount ,
        maxStudentCount,
        courseType: reservation.reservationMembers[0].orderMember.order.type,
        skiType: reservation.reservationMembers[0].orderMember.order.skiType,

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
        reservationStatus: body.reservationStatus || ReservationStatus.SCHEDULED,
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

      const nextIndex = existingOrderReservations.length > 0
        ? existingOrderReservations[0].index + 1
        : 1;

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
  async updateReservation(id: string, body: UpdateReservationRequestDto, userId?: string) {
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
        reservation.reservationStatus = body.reservationStatus as ReservationStatus;
      }
      reservation.updatedUser = userId;

      return await this.reservationsRepo.save(reservation);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 更新預約狀態
  async updateReservationStatus(id: string, status: ReservationStatus, userId?: string) {
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

      const linkedOrders = orderReservations.map(or => ({
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
}