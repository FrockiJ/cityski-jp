import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkiAndSnowboardLevelEnum } from '@repo/shared';
import { Reservation } from './entities/reservation.entity';
import { Department } from 'src/departments/entities/department.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { ReservationStatus } from './entities/reservation.entity';

export interface CreateReservationRequestDTO {
  departmentId: string;
  classTime: Date;
  teachingLevel: SkiAndSnowboardLevelEnum;
  instructor?: string;
  reservationStatus?: ReservationStatus;
}

export interface GetReservationsRequestDTO {
  departmentId?: string;
  reservationStatus?: ReservationStatus;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface GetReservationDetailResponseDTO {
  id: string;
  reservationNo: number;
  reservationStatus: ReservationStatus;
  classTime: Date;
  teachingLevel: SkiAndSnowboardLevelEnum;
  instructor: string | null;
  departmentName: string;
  createdTime: Date;
  updatedTime: Date;
  linkedOrders?: Array<{
    orderId: string;
    orderNo: string;
    index: number;
    orderReservationId: string;
  }>;
  reservationMembers?: Array<{
    id: string;
    reservationId: string;
    orderMemberId: string;
    note?: string;
    orderMember?: {
      id: string;
      orderId: string;
      memberId: string;
      member: {
        id: string;
        name: string;
        phone: string | null;
        birthday: Date | null;
        avatar: string | null;
        skis: number;
        snowboard: number;
      };
      order: {
        id: string;
        no: string;
        status: number;
      };
    };
  }>;
}

export interface UpdateReservationRequestDTO {
  departmentId?: string;
  classTime?: Date;
  teachingLevel?: SkiAndSnowboardLevelEnum;
  instructor?: string;
  reservationStatus?: ReservationStatus;
}

export interface ResWithPaginationDTO<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  pages: number;
}

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
    @InjectRepository(OrderReservation)
    private readonly orderReservationsRepo: Repository<OrderReservation>,
  ) {}

  // 獲取預約列表
  async getReservations(
    request: GetReservationsRequestDTO,
  ): Promise<ResWithPaginationDTO<Reservation[]>> {
    try {
      const queryBuilder = this.reservationsRepo.createQueryBuilder('r')
        .leftJoinAndSelect('r.department', 'department');

      // 根據部門ID篩選
      if (request.departmentId) {
        queryBuilder.andWhere('r.department_id = :departmentId', {
          departmentId: request.departmentId,
        });
      }

      // 根據課程狀態篩選
      if (request.reservationStatus !== undefined && request.reservationStatus !== null) {
        queryBuilder.andWhere('r.course_status = :reservationStatus', {
          reservationStatus: request.reservationStatus,
        });
      }

      // 根據關鍵字搜索預約編號或指定教練
      if (request.keyword) {
        queryBuilder.andWhere(
          '(r.reservation_no LIKE :keyword OR r.instructor LIKE :keyword)',
          { keyword: `%${request.keyword}%` }
        );
      }

      // 排序：最新的預約在前
      queryBuilder.orderBy('r.createdTime', 'DESC');

      const reservations = await queryBuilder.getMany();

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
      const paginatedReservations = reservations.slice(startIndex, endIndex);

      const total = reservations.length;

      const res = {
        data: paginatedReservations,
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

  // 根據ID獲取預約詳情
  async getReservationDetail(id: string): Promise<GetReservationDetailResponseDTO> {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: ['department', 'reservationMembers', 'reservationMembers.orderMember', 'reservationMembers.orderMember.member', 'reservationMembers.orderMember.order'],
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
      const reservationMembers: GetReservationDetailResponseDTO['reservationMembers'] = reservation.reservationMembers?.map(rm => ({
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
            status: rm.orderMember.order.status,
          },
        } : undefined,
      }));

      const reservationDetail: GetReservationDetailResponseDTO = {
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
  async createReservation(body: CreateReservationRequestDTO, userId?: string) {
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

      const savedReservation = this.reservationsRepo.create({
        ...new Reservation(),
        reservationStatus: body.reservationStatus || ReservationStatus.SCHEDULED,
        classTime: body.classTime,
        teachingLevel: body.teachingLevel,
        instructor: body.instructor || null,
        createdUser: userId,
        updatedUser: userId,
        department: department,
      });

      return await this.reservationsRepo.save(savedReservation);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 更新預約
  async updateReservation(id: string, body: UpdateReservationRequestDTO, userId?: string) {
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