import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { OrderMember } from './entities/order-member.entity';
import { Order } from 'src/orders/entities/order.entity';
import {
  OrderMemberSearchResponseDto,
  TransferOrderMemberRequestDto,
  CourseType,
  CourseSkiType,
} from '@repo/shared';
import { OrderHistoryService } from 'src/order-history/order-history.service';
import { MembersService } from 'src/members/members.service';
import { OrderReservationsService } from 'src/order-reservations/order-reservations.service';
import { ReservationMembersService } from 'src/reservation-members/reservation-members.service';
import { ReservationStatus } from 'src/reservations/entities/reservation.entity';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';

@Injectable()
export class OrderMembersService {
  constructor(
    @InjectRepository(OrderMember)
    private readonly orderMembersRepo: Repository<OrderMember>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => OrderHistoryService))
    private readonly orderHistoryService: OrderHistoryService,
    @Inject(forwardRef(() => MembersService))
    private readonly membersService: MembersService,
    @Inject(forwardRef(() => OrderReservationsService))
    private readonly orderReservationsService: OrderReservationsService,
    @Inject(forwardRef(() => ReservationMembersService))
    private readonly reservationMembersService: ReservationMembersService,
  ) {}

  async create(orderMemberData: Partial<OrderMember>): Promise<OrderMember> {
    try {
      // 1. Create and save the orderMember
      const orderMember = this.orderMembersRepo.create(orderMemberData);
      const savedOrderMember = await this.orderMembersRepo.save(orderMember);

      // 2. Fetch the order to check if it's a designated group course
      const order = await this.ordersRepo.findOne({
        where: { id: orderMemberData.orderId },
        select: ['id', 'type', 'bkgType'],
      });

      if (!order) {
        throw new HttpException(
          `Order with id: ${orderMemberData.orderId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // 3. Check if this is a designated group course (指定式課程的團體班)
      // type='G' (GROUP) && bkgType=2 (FIXED/designated)
      if (order.type === 'G' && order.bkgType === 2) {
        console.log('Designated group course detected, adding to reservations');
        // 4. Find all reservations for this order
        const orderReservations =
          await this.orderReservationsService.findByOrderId(order.id);
        console.log('orderReservations', orderReservations);

        // 5. Filter out orderReservations that don't have a valid reservationId
        const validOrderReservations = orderReservations.filter(
          (or) => or.reservationId !== null,
        );
        console.log('validOrderReservations', validOrderReservations);

        // 6. Add the orderMember to each reservation
        if (validOrderReservations.length > 0) {
          console.log('Adding orderMember to reservations');
          for (const orderReservation of validOrderReservations) {
            await this.reservationMembersService.create({
              reservationId: orderReservation.reservationId,
              orderMemberId: savedOrderMember.id,
              attended: true,
            });
          }
        }
      }

      return savedOrderMember;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateOrderOwnership(
    orderId: string,
    memberId: string,
  ): Promise<boolean> {
    try {
      const order = await this.ordersRepo.findOne({
        where: {
          id: orderId,
          orderer: memberId,
        },
      });
      return !!order;
    } catch (err) {
      return false;
    }
  }

  async findAll(): Promise<OrderMember[]> {
    try {
      return await this.orderMembersRepo.find({
        where: { active: true },
        relations: ['order', 'member'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<OrderMember> {
    try {
      const orderMember = await this.orderMembersRepo.findOne({
        where: { id },
        relations: ['order', 'member'],
      });

      if (!orderMember) {
        throw new HttpException(
          `OrderMember with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return orderMember;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByOrderId(orderId: string): Promise<OrderMember[]> {
    try {
      return await this.orderMembersRepo.find({
        where: { orderId, active: true },
        relations: ['member'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByMemberId(memberId: string): Promise<OrderMember[]> {
    try {
      return await this.orderMembersRepo.find({
        where: { memberId, active: true },
        relations: ['order'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateData: Partial<OrderMember>,
  ): Promise<OrderMember> {
    try {
      const orderMember = await this.findOne(id);
      Object.assign(orderMember, updateData);
      return await this.orderMembersRepo.save(orderMember);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const orderMember = await this.findOne(id);
      await this.orderMembersRepo.remove(orderMember);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async transfer(
    transferData: TransferOrderMemberRequestDto,
  ): Promise<OrderMember> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find and validate source orderMember (fromId)
      const sourceOrderMember = await this.orderMembersRepo.findOne({
        where: { id: transferData.fromId },
        relations: ['order'],
      });

      if (!sourceOrderMember) {
        throw new HttpException(
          `OrderMember with id: ${transferData.fromId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!sourceOrderMember.active) {
        throw new HttpException(
          `OrderMember with id: ${transferData.fromId} is already inactive`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Validate target member exists (toId)
      const targetMember = await this.membersService.findMemberById(
        transferData.toId,
      );
      if (!targetMember) {
        throw new HttpException(
          `Member with id: ${transferData.toId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Validate not transferring to the same member
      if (sourceOrderMember.memberId === transferData.toId) {
        throw new HttpException(
          'Cannot transfer to the same member',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate source has remaining lessons
      const allOrderReservations = await queryRunner.manager.find(
        OrderReservation,
        {
          where: { orderId: sourceOrderMember.orderId },
          relations: ['reservation'],
        },
      );

      const completeReservationCount = allOrderReservations.filter(
        (or) =>
          or.reservation && (
          or.reservation.reservationStatus === ReservationStatus.COMPLETED ||
          or.reservation.reservationStatus === ReservationStatus.PENDING_REVIEW),
          
          
      ).length;

      const remainingLessons =
        sourceOrderMember.order.planNumber - completeReservationCount;

      if (remainingLessons <= 0) {
        throw new HttpException(
          `無法轉移：此訂單已無剩餘堂數 (已使用 ${completeReservationCount} / ${sourceOrderMember.order.planNumber} 堂)`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate target doesn't already own this order
      const existingTargetOrderMember = await queryRunner.manager.findOne(
        OrderMember,
        {
          where: {
            orderId: sourceOrderMember.orderId,
            memberId: transferData.toId,
            active: true,
          },
        },
      );

      if (existingTargetOrderMember) {
        throw new HttpException(
          '目標會員已擁有此訂單',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Find ReservationMembers for SCHEDULED reservations
      const reservationMembersToTransfer = await queryRunner.manager
        .createQueryBuilder(ReservationMember, 'rm')
        .innerJoinAndSelect('rm.reservation', 'reservation')
        .where('rm.orderMemberId = :sourceOrderMemberId', {
          sourceOrderMemberId: sourceOrderMember.id,
        })
        .andWhere('reservation.reservationStatus = :scheduledStatus', {
          scheduledStatus: ReservationStatus.SCHEDULED,
        })
        .getMany();

      // Create new OrderMember FIRST (needed for FK constraint)
      const newOrderMember = this.orderMembersRepo.create({
        orderId: sourceOrderMember.orderId,
        memberId: transferData.toId,
        active: true,
      });
      const savedOrderMember = await queryRunner.manager.save(newOrderMember);

      // Bulk update ReservationMembers to point to new OrderMember
      if (reservationMembersToTransfer.length > 0) {
        const reservationMemberIds = reservationMembersToTransfer.map(
          (rm) => rm.id,
        );

        await queryRunner.manager
          .createQueryBuilder()
          .update(ReservationMember)
          .set({ orderMemberId: savedOrderMember.id })
          .where('id IN (:...ids)', { ids: reservationMemberIds })
          .execute();
      }

      const transferredCount = reservationMembersToTransfer.length;

      // 3. Set source orderMember active to false
      sourceOrderMember.active = false;
      await queryRunner.manager.save(sourceOrderMember);

      // 5. Record detailed history
      const sourceMemberName =
        (await this.membersService.findMemberById(sourceOrderMember.memberId))
          ?.name || '未知';
      const targetMemberName =
        (await this.membersService.findMemberById(transferData.toId))?.name ||
        '未知';

      await this.orderHistoryService.create({
        orderId: sourceOrderMember.orderId,
        event: `會員轉移`,
        reason: `${sourceMemberName} → ${targetMemberName}`,
        operator: 'system',
      });

      await queryRunner.commitTransaction();

      // Return the new orderMember with relations
      return await this.findOne(savedOrderMember.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async searchWithCoursesLeft(
    keyword: string,
    orderType?: CourseType,
    skiType?: CourseSkiType,
    orderNo?: string,
    coursePlanId?: string,
  ): Promise<OrderMemberSearchResponseDto[]> {
    try {
      // Use QueryBuilder to filter by courses left
      const queryBuilder = this.orderMembersRepo
        .createQueryBuilder('om')
        .leftJoin('om.member', 'member')
        .leftJoin('om.order', 'order')
        .leftJoin('order.orderReservations', 'orderReservations')
        .where('om.active = :active', { active: true });

      // Member number exact search (精準搜尋會員編號)
      if (keyword && keyword.trim()) {
        queryBuilder.andWhere('member.no = :keyword', { keyword: keyword.trim() });
      }

      // Order type filter
      if (orderType) {
        queryBuilder.andWhere('order.type = :orderType', { orderType });
      }

      // Ski type filter
      if (skiType !== undefined && skiType !== null) {
        queryBuilder.andWhere('order.skiType = :skiType', { skiType });
      }

      // Order number filter
      if (orderNo && orderNo.trim()) {
        queryBuilder.andWhere('order.no LIKE :orderNo', {
          orderNo: `%${orderNo}%`,
        });
      }

      // Course plan filter
      if (coursePlanId && coursePlanId.trim()) {
        queryBuilder.andWhere('order.coursePlanId = :coursePlanId', {
          coursePlanId,
        });
      }

      // Group and filter by courses left
      // Only return order members where used courses < planned courses
      queryBuilder
        .groupBy('om.id')
        .addGroupBy('member.id')
        .addGroupBy('order.id')
        .having('COUNT(orderReservations.id) < order.planNumber')
        .orderBy('member.name', 'ASC');

      // Execute first query to get filtered IDs
      const filteredResults = await queryBuilder.getMany();

      // If no results, return empty array
      if (filteredResults.length === 0) {
        return [];
      }

      // Reload with full relations for the response DTO
      const results = await this.orderMembersRepo.find({
        where: { id: In(filteredResults.map((r) => r.id)) },
        relations: {
          member: true,
          order: {
            orderReservations: true,
            coursePlan: true,
          },
        },
        order: {
          member: {
            name: 'ASC',
          },
        },
      });

      return results;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
