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
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

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
    const { fromDate, toDate, sortBy, sortOrder, search } = request;

    // Default date range: current month ± 3 months
    const from = fromDate
      ? new Date(fromDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 3));

    // Set 'to' date to end of the month (last day, 23:59:59.999)
    let to: Date;
    if (toDate) {
      to = new Date(toDate);
      // Set to last day of the month at 23:59:59.999
      to.setMonth(to.getMonth() + 1, 0); // Sets to last day of the month
      to.setHours(23, 59, 59, 999);
    } else {
      to = new Date(new Date().setMonth(new Date().getMonth() + 3));
    }

    this.logger.log(`Date range: ${from.toISOString()} to ${to.toISOString()}`);

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
    let items: InventoryItemDTO[] = [];
    inventoryMap.forEach((orderItems) => {
      items.push(...orderItems);
    });

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchLower) ||
          item.customerPhone.includes(searchLower) ||
          item.orderNo.toLowerCase().includes(searchLower)
      );
    }

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

  async exportInventory(
    res: Response,
    request: GetInventoryRequestDTO,
  ): Promise<void> {
    // 1. Reuse existing getInventory logic for consistency
    const inventoryData = await this.getInventory(request);

    // 2. Extract and sort unique month columns
    const monthColumns = this.extractMonthColumns(inventoryData.items);

    // 3. Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('清冊');

    // 4. Define columns (static + dynamic months)
    const columns: Partial<ExcelJS.Column>[] = [
      { header: '訂購人', key: 'customerName', width: 15 },
      { header: '手機', key: 'customerPhone', width: 15 },
      { header: '訂單編號', key: 'orderNo', width: 20 },
      { header: '課程類型', key: 'courseType', width: 12 },
      { header: '人數', key: 'participantCount', width: 8 },
      { header: '總金額', key: 'totalAmount', width: 12 },
      { header: '餘額', key: 'balance', width: 12 },
    ];

    monthColumns.forEach((month) => {
      columns.push({ header: month, key: month, width: 12 });
    });

    worksheet.columns = columns;

    // 5. Add data rows
    inventoryData.items.forEach((item) => {
      const row: any = {
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        orderNo: `${item.orderNo} (${this.getCourseTypeLabel(item.courseType)})`,
        courseType: this.getCourseTypeLabel(item.courseType),
        participantCount: item.participantCount,
        totalAmount: item.totalAmount,
        balance: item.balance,
      };

      monthColumns.forEach((month) => {
        row[month] = item.monthlyUsage[month] || 0;
      });

      worksheet.addRow(row);
    });

    // 6. Add summary row
    const summaryRow: any = {
      customerName: `共${inventoryData.summary.totalCount}筆`,
      customerPhone: '',
      orderNo: '',
      courseType: '',
      participantCount: '',
      totalAmount: inventoryData.summary.totalAmount,
      balance: inventoryData.summary.totalBalance,
    };

    monthColumns.forEach((month) => {
      summaryRow[month] = '';
    });

    const summaryRowObj = worksheet.addRow(summaryRow);
    summaryRowObj.font = { bold: true };

    // 7. Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    // 8. Number formatting for currency
    worksheet.getColumn('totalAmount').numFmt = '#,##0';
    worksheet.getColumn('balance').numFmt = '#,##0';
    monthColumns.forEach((month) => {
      worksheet.getColumn(month).numFmt = '#,##0';
    });

    // 9. Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="inventory-${new Date().toISOString().split('T')[0]}.xlsx"`,
    );

    // 10. Write to response
    await workbook.xlsx.write(res);
    res.end();
  }

  // Helper: Extract and sort month columns
  private extractMonthColumns(items: InventoryItemDTO[]): string[] {
    const monthSet = new Set<string>();
    items.forEach((item) => {
      Object.keys(item.monthlyUsage).forEach((month) => monthSet.add(month));
    });

    return Array.from(monthSet).sort((a, b) => a.localeCompare(b));
  }

  // Helper: Map course type to Chinese label
  private getCourseTypeLabel(courseType: string): string {
    const typeMap: Record<string, string> = {
      P: '私人課',
      G: '團體課',
      I: '個人練習',
    };
    return typeMap[courseType] || courseType;
  }
}
