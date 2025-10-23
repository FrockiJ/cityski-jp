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
        relations: ['department'],
      });

      if (!reservation) {
        throw new CustomException(
          `Reservation with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

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
}