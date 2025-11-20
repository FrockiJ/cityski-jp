import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ReservationMember } from './entities/reservation-member.entity';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';
import { OrderMember } from '../order-members/entities/order-member.entity';
import { OrderReservation } from '../order-reservations/entities/order-reservation.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class ReservationMembersService {
  constructor(
    @InjectRepository(ReservationMember)
    private readonly reservationMembersRepo: Repository<ReservationMember>,
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
    @InjectRepository(OrderMember)
    private readonly orderMembersRepo: Repository<OrderMember>,
    @InjectRepository(OrderReservation)
    private readonly orderReservationsRepo: Repository<OrderReservation>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    reservationMemberData: Partial<ReservationMember>,
  ): Promise<ReservationMember> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 獲取 orderMember 信息（包含 orderId）
      const orderMember = await this.orderMembersRepo.findOne({
        where: { id: reservationMemberData.orderMemberId },
        relations: ['order'],
      });

      if (!orderMember) {
        throw new HttpException('OrderMember not found', HttpStatus.NOT_FOUND);
      }

      const order = orderMember.order;

      // 2. 檢查該訂單是否已有此預約的 OrderReservation
      const existingOrderReservation = await queryRunner.manager.findOne(
        OrderReservation,
        {
          where: {
            orderId: order.id,
            reservationId: reservationMemberData.reservationId,
          },
        },
      );

      // 3. 如果不存在，需要創建 OrderReservation
      if (!existingOrderReservation) {
        // 3a. 查找該訂單所有現有的 OrderReservation
        const allOrderReservations = await queryRunner.manager.find(
          OrderReservation,
          {
            where: { orderId: order.id },
            order: { index: 'ASC' },
          },
        );

        // 3b. 驗證：已使用的堂數是否已達上限
        if (allOrderReservations.length >= order.planNumber) {
          await queryRunner.rollbackTransaction();
          throw new HttpException(
            `無法新增預約：訂單已達堂數上限 (${order.planNumber} 堂)`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // 3c. 找到第一個可用的 index（從 0 開始）
        const usedIndices = new Set(allOrderReservations.map((or) => or.index));
        let availableIndex = 0;
        while (
          usedIndices.has(availableIndex) &&
          availableIndex < order.planNumber
        ) {
          availableIndex++;
        }

        // 3d. 再次驗證 index 不超過 planNumber
        if (availableIndex >= order.planNumber) {
          await queryRunner.rollbackTransaction();
          throw new HttpException(
            `無法分配 index：所有堂數已被使用`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // 3e. 創建 OrderReservation
        const newOrderReservation = queryRunner.manager.create(
          OrderReservation,
          {
            orderId: order.id,
            reservationId: reservationMemberData.reservationId,
            index: availableIndex,
          },
        );
        await queryRunner.manager.save(newOrderReservation);
      }

      // 4. 創建 ReservationMember
      const reservationMember = queryRunner.manager.create(
        ReservationMember,
        reservationMemberData,
      );
      const savedMember = await queryRunner.manager.save(reservationMember);

      await queryRunner.commitTransaction();
      return savedMember;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err.status
        ? err
        : new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<ReservationMember[]> {
    try {
      return await this.reservationMembersRepo.find({
        relations: ['reservation', 'orderMember', 'orderMember.member', 'orderMember.order'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<ReservationMember> {
    try {
      const reservationMember = await this.reservationMembersRepo.findOne({
        where: { id },
        relations: ['reservation', 'orderMember', 'orderMember.member', 'orderMember.order'],
      });

      if (!reservationMember) {
        throw new HttpException(
          `ReservationMember with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return reservationMember;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByReservationId(reservationId: string): Promise<ReservationMember[]> {
    try {
      return await this.reservationMembersRepo.find({
        where: { reservationId },
        relations: ['orderMember', 'orderMember.member', 'orderMember.order'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByOrderMemberId(orderMemberId: string): Promise<ReservationMember[]> {
    try {
      return await this.reservationMembersRepo.find({
        where: { orderMemberId },
        relations: ['reservation', 'orderMember', 'orderMember.member', 'orderMember.order'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateData: Partial<ReservationMember>,
  ): Promise<ReservationMember> {
    try {
      const reservationMember = await this.findOne(id);

      // Check if note or attended is being updated
      const isNoteOrAttendedUpdate =
        updateData.note !== undefined ||
        updateData.attended !== undefined;

      Object.assign(reservationMember, updateData);
      const savedMember = await this.reservationMembersRepo.save(reservationMember);

      // If note or attendance updated, check if reservation should auto-complete
      if (isNoteOrAttendedUpdate && reservationMember.reservation) {
        const reservation = await this.reservationsRepo.findOne({
          where: { id: reservationMember.reservationId },
        });

        // Only auto-update if status is PENDING_REVIEW (2)
        if (reservation && reservation.reservationStatus === ReservationStatus.PENDING_REVIEW) {
          // Update to COMPLETED (3)
          reservation.reservationStatus = ReservationStatus.COMPLETED;
          await this.reservationsRepo.save(reservation);
        }
      }

      return savedMember;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const reservationMember = await this.findOne(id);
      await this.reservationMembersRepo.remove(reservationMember);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
