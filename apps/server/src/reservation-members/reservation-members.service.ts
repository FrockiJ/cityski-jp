import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ReservationMember } from './entities/reservation-member.entity';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';
import { OrderMember } from '../order-members/entities/order-member.entity';
import { OrderReservation } from '../order-reservations/entities/order-reservation.entity';
import { Order } from '../orders/entities/order.entity';
import { Member } from '../members/entities/member.entity';
import { CourseSkiType, OrderStatus } from '@repo/shared';

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
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Member)
    private readonly membersRepo: Repository<Member>,
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
        relations: [
          'orderMember',
          'orderMember.member',
          'orderMember.order',
          'orderMember.order.orderReservations',
          'orderMember.order.orderReservations.reservation',
          'orderMember.order.orderReservations.reservation.reservationMembers',
        ],
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

          // 當預約狀態變為已完成時，自動提升有出席成員的滑雪等級
          await this.upgradeMemberLevelsOnCompletion(reservation.id);

          // 檢查相關訂單是否所有預約都已完成，如果是則將訂單狀態變為已完成
          await this.checkAndCompleteOrdersForReservation(reservation.id);
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

  /**
   * 當預約狀態變為已完成時，提升有出席成員的滑雪等級
   * @param reservationId - 預約 ID
   */
  async upgradeMemberLevelsOnCompletion(reservationId: string): Promise<void> {
    try {
      // 1. 取得預約資訊（包含 teachingLevel）
      const reservation = await this.reservationsRepo.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        return;
      }

      const teachingLevel = reservation.teachingLevel;

      // 如果 teachingLevel 為空或為 '-'，則不處理
      if (!teachingLevel || teachingLevel === '-') {
        return;
      }

      const courseLevel = parseInt(teachingLevel, 10);
      if (isNaN(courseLevel)) {
        return;
      }

      // 2. 取得該預約所有成員（包含出席狀態、訂單資訊）
      const reservationMembers = await this.reservationMembersRepo.find({
        where: { reservationId },
        relations: ['orderMember', 'orderMember.order', 'orderMember.member'],
      });

      // 3. 對每個有出席的成員進行等級提升
      for (const rm of reservationMembers) {
        // 只處理有出席的成員
        if (!rm.attended) {
          continue;
        }

        const member = rm.orderMember?.member;
        const order = rm.orderMember?.order;

        if (!member || !order) {
          continue;
        }

        const skiType = order.skiType;
        let needsUpdate = false;

        // 根據課程類型（skiType）決定更新哪個等級
        // CourseSkiType: 0 = 雙板+單板, 1 = 單板(snowboard), 2 = 雙板(skis)
        if (skiType === CourseSkiType.SNOWBOARD || skiType === CourseSkiType.BOTH) {
          // 單板：如果課程等級 > 當前等級，則提升
          if (courseLevel > member.snowboard) {
            member.snowboard = courseLevel;
            needsUpdate = true;
          }
        }

        
        if (skiType === CourseSkiType.SKI || skiType === CourseSkiType.BOTH) {
          // 雙板：如果課程等級 > 當前等級，則提升
          if (courseLevel > member.skis) {
            member.skis = courseLevel;
            needsUpdate = true;
          }
        }

        // 4. 儲存更新後的會員資料
        if (needsUpdate) {
          await this.membersRepo.save(member);
        }
      }
    } catch (err) {
      // 等級提升失敗不應影響主流程，僅記錄錯誤
      console.error('Failed to upgrade member levels:', err);
    }
  }

  /**
   * 檢查並完成訂單
   * 當預約從待紀錄變成已完成時，檢查相關訂單是否所有預約都已完成
   * 如果滿足條件，則將訂單狀態變更為已完成
   * @param reservationId - 預約 ID
   */
  async checkAndCompleteOrdersForReservation(reservationId: string): Promise<void> {
    try {
      // 1. 找到與此預約相關的所有訂單（通過 OrderReservation）
      const orderReservations = await this.orderReservationsRepo.find({
        where: { reservationId },
      });

      if (!orderReservations || orderReservations.length === 0) {
        return;
      }

      // 2. 對每個訂單進行檢查
      const orderIds = new Set(orderReservations.map(or => or.orderId));

      for (const orderId of orderIds) {
        await this.checkAndCompleteOrder(orderId);
      }
    } catch (err) {
      // 訂單狀態更新失敗不應影響主流程，僅記錄錯誤
      console.error('Failed to check and complete orders:', err);
    }
  }

  /**
   * 檢查單個訂單是否所有預約都已完成，如果是則更新訂單狀態為已完成
   * @param orderId - 訂單 ID
   */
  private async checkAndCompleteOrder(orderId: string): Promise<void> {
    try {
      // 1. 獲取訂單資訊
      const order = await this.ordersRepo.findOne({
        where: { id: orderId },
      });

      if (!order) {
        return;
      }

      // 只處理狀態為 ORDER_SUCCESSFUL (2, 訂購成功) 的訂單
      if (order.status !== OrderStatus.ORDER_SUCCESSFUL) {
        return;
      }

      // 2. 獲取該訂單的所有預約（通過 OrderReservation）
      const orderReservations = await this.orderReservationsRepo.find({
        where: { orderId },
        relations: ['reservation'],
      });

      if (!orderReservations || orderReservations.length === 0) {
        return;
      }

      // 3. 過濾出所有有效的預約（排除已取消的預約）
      const activeReservations = orderReservations.filter(
        or => or.reservation && or.reservation.reservationStatus !== ReservationStatus.CANCELED
      );

      // 4. 檢查訂單是否有足夠的預約（應該等於 planNumber）
      if (activeReservations.length !== order.planNumber) {
        // 預約數量不等於訂購堂數，不符合完成條件
        return;
      }

      // 5. 檢查所有有效預約是否都已完成
      const allCompleted = activeReservations.every(
        or => or.reservation.reservationStatus === ReservationStatus.COMPLETED
      );

      // 6. 如果所有預約都已完成，則將訂單狀態更新為已完成
      if (allCompleted) {
        order.status = OrderStatus.ORDER_COMPLETED;
        await this.ordersRepo.save(order);
        console.log(`Order ${order.no} (${orderId}) has been marked as completed - all ${order.planNumber} reservations are completed.`);
      }
    } catch (err) {
      console.error(`Failed to check and complete order ${orderId}:`, err);
    }
  }
}
