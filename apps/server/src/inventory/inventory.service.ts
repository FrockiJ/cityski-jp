import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, Not } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { Reservation, ReservationStatus } from 'src/reservations/entities/reservation.entity';
import {
  GetInventoryRequestDTO,
  GetInventoryResponseDTO,
  InventoryItemDTO,
  OrderStatus,
  TransactionStatus,
} from '@repo/shared';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderReservation)
    private orderReservationRepository: Repository<OrderReservation>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async getInventory(
    request: GetInventoryRequestDTO,
  ): Promise<GetInventoryResponseDTO> {
    const { fromDate, toDate, sortBy, sortOrder } = request;

    // Default date range: current month ± 3 months
    const from = fromDate
      ? new Date(fromDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 3));
    const to = toDate
      ? new Date(toDate)
      : new Date(new Date().setMonth(new Date().getMonth() + 3));

    // Find all valid orders (等待確認 or 訂購成功, not 已完成)
    const orders = await this.orderRepository.find({
      where: {
        status: In([OrderStatus.WAITING_FOR_CONFIRMATION, OrderStatus.ORDER_SUCCESSFUL]),
        transaction: {
          status: In([
            TransactionStatus.DEPOSIT_PAID,
            TransactionStatus.FULLY_PAID,
          ]),
        },
      },
      relations: [
        'member',
        'transaction',
        'coursePlan',
        'coursePlan.course',
        'orderReservations',
        'orderReservations.reservation',
      ],
    });

    // Group by member and order
    const inventoryMap = new Map<string, InventoryItemDTO[]>();

    for (const order of orders) {
      const memberId = order.member.id;
      const memberKey = `${order.member.name}-${order.member.phone}`;

      if (!inventoryMap.has(memberKey)) {
        inventoryMap.set(memberKey, []);
      }

      // Get all reservations for this order
      const orderReservations = await this.orderReservationRepository.find({
        where: { orderId: order.id },
        relations: ['reservation'],
      });

      // Calculate total amount and unit price
      const totalAmount = order.transaction?.totalAmt || 0;
      const totalSessions = order.planNumber || 0;
      const unitPrice = totalSessions > 0 ? totalAmount / totalSessions : 0;
      // Count RESERVED sessions (all orderReservations with non-null reservationId)
      const reservedCount = orderReservations.filter(or => or.reservationId !== null).length;




      // Calculate monthly usage for display (only within date range)
      const monthlyUsage: { [key: string]: number } = {};

      // Filter reservations within date range and not completed/canceled
      const validReservations = orderReservations.filter((or) => {
        const reservation = or.reservation;
        if (!reservation) return false;

        const classTime = new Date(reservation.classTime);
        return (
          classTime >= from &&
          classTime <= to &&
          reservation.reservationStatus !== ReservationStatus.CANCELED
        );
      });
      // Calculate correct balance
      const balance = totalAmount - (validReservations.length * unitPrice);
      console.log(`Order ${order.id} - Total Amount: ${totalAmount}, Unit Price: ${unitPrice}, Reserved Count: ${reservedCount}, validReservations: ${validReservations.length}`);

      // Allocate unit price to months for display
      for (const or of validReservations) {
        const reservation = or.reservation;
        const classTime = new Date(reservation.classTime);
        const monthKey = `${classTime.getFullYear()}/${String(classTime.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyUsage[monthKey]) {
          monthlyUsage[monthKey] = 0;
        }

        monthlyUsage[monthKey] += unitPrice;
      }

      // Extract course type
      const courseType = order.coursePlan?.course?.type || '';

      // Create inventory item
      const inventoryItem: InventoryItemDTO = {
        customerName: order.member.name,
        customerPhone: order.member.phone,
        orderId: order.id,
        orderNo: order.no,
        courseName: order.coursePlan?.name || '',
        courseType: courseType,
        participantCount: (order.adultCount || 0) + (order.childCount || 0),
        totalAmount: totalAmount,
        balance: balance,
        monthlyUsage,
      };

      inventoryMap.get(memberKey)?.push(inventoryItem);
    }

    // Convert map to array
    const items: InventoryItemDTO[] = [];
    inventoryMap.forEach((orderItems) => {
      items.push(...orderItems);
    });

    // Sort items
    if (sortBy) {
      items.sort((a, b) => {
        let compareValue = 0;

        switch (sortBy) {
          case 'totalAmount':
            compareValue = a.totalAmount - b.totalAmount;
            break;
          case 'balance':
            compareValue = a.balance - b.balance;
            break;
          default:
            // Sort by monthly columns
            const aValue = a.monthlyUsage[sortBy] || 0;
            const bValue = b.monthlyUsage[sortBy] || 0;
            compareValue = aValue - bValue;
        }

        return sortOrder === 'asc' ? compareValue : -compareValue;
      });
    } else {
      // Default sort: totalAmount descending
      items.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    // Calculate summary
    const totalCount = items.length;
    const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalBalance = items.reduce((sum, item) => sum + item.balance, 0);

    return {
      items,
      summary: {
        totalCount,
        totalAmount,
        totalBalance,
      },
      dateRange: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    };
  }
}
