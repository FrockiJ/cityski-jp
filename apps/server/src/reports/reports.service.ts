import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from 'src/reservations/entities/reservation.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(OrderReservation)
    private orderReservationRepository: Repository<OrderReservation>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderMember)
    private orderMemberRepository: Repository<OrderMember>,
    @InjectRepository(ReservationMember)
    private reservationMemberRepository: Repository<ReservationMember>,
  ) {}

  async getMonthlyStats(year?: number, month?: number) {
    try {
      const currentDate = new Date();
      const targetYear = year || currentDate.getFullYear();
      const targetMonth = month || currentDate.getMonth() + 1;
      
      // Calculate start and end dates for current month
      const currentMonthStart = new Date(targetYear, targetMonth - 1, 1);
      const currentMonthEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59);
      
      // Calculate start and end dates for same month last year
      const lastYearStart = new Date(targetYear - 1, targetMonth - 1, 1);
      const lastYearEnd = new Date(targetYear - 1, targetMonth, 0, 23, 59, 59);

      console.log('Date calculations:');
      console.log('Target year/month:', targetYear, targetMonth);
      console.log('Current month period:', currentMonthStart, 'to', currentMonthEnd);
      console.log('Last year same month period:', lastYearStart, 'to', lastYearEnd);

      // Get current month data
      const currentStats = await this.getMonthStats(currentMonthStart, currentMonthEnd);
      console.log('Current month stats:', currentStats);
      
      // Get last year same month data
      const lastYearStats = await this.getMonthStats(lastYearStart, lastYearEnd);
      console.log('Last year same month stats:', lastYearStats);

      // Calculate growth rates with proper type conversion
      const currentClasses = Number(currentStats.classesCount) || 0;
      const lastYearClasses = Number(lastYearStats.classesCount) || 0;
      const currentQuota = Number(currentStats.quotaAmount) || 0;
      const lastYearQuota = Number(lastYearStats.quotaAmount) || 0;

      // Use null to indicate "NA" when last year data is 0
      const classesGrowthRate = lastYearClasses === 0 
        ? null
        : ((currentClasses - lastYearClasses) / lastYearClasses) * 100;
      
      const quotaGrowthRate = lastYearQuota === 0 
        ? null
        : ((currentQuota - lastYearQuota) / lastYearQuota) * 100;

      console.log('Growth rates calculated:', {
        classesGrowthRate: Number.isFinite(classesGrowthRate) ? classesGrowthRate : 0,
        quotaGrowthRate: Number.isFinite(quotaGrowthRate) ? quotaGrowthRate : 0,
        currentClasses,
        lastYearClasses,
        currentQuota,
        lastYearQuota,
        rawCurrentQuota: currentStats.quotaAmount,
        rawLastYearQuota: lastYearStats.quotaAmount
      });

      return {
        classesCount: currentClasses,
        quotaAmount: currentQuota,
        classesGrowthRate: classesGrowthRate === null ? null : (Number.isFinite(classesGrowthRate) ? Math.round(classesGrowthRate * 10) / 10 : 0),
        quotaGrowthRate: quotaGrowthRate === null ? null : (Number.isFinite(quotaGrowthRate) ? Math.round(quotaGrowthRate * 10) / 10 : 0),
      };
    } catch (error) {
      console.error('Error in getMonthlyStats:', error);
      // Return default values on error
      return {
        classesCount: 0,
        quotaAmount: 0,
        classesGrowthRate: null,
        quotaGrowthRate: null,
      };
    }
  }

  private async getMonthStats(startDate: Date, endDate: Date) {
    try {
      console.log('Getting stats for period:', startDate, 'to', endDate);
      
      // Get classes count (reservations that are not canceled)
      const classesCount = await this.reservationRepository
        .createQueryBuilder('reservation')
        .where('reservation.classTime >= :startDate', { startDate })
        .andWhere('reservation.classTime <= :endDate', { endDate })
        .andWhere('reservation.reservationStatus != :canceledStatus', { 
          canceledStatus: ReservationStatus.CANCELED 
        })
        .getCount();

      console.log('Classes count:', classesCount);

      // Get quota amount - simplified approach
      let quotaAmount = 0;
      
      try {
        // First, get all reservations in the period
        const reservations = await this.reservationRepository
          .createQueryBuilder('reservation')
          .leftJoinAndSelect('reservation.orderReservations', 'orderReservation')
          .leftJoinAndSelect('orderReservation.order', 'order')
          .leftJoinAndSelect('order.coursePlan', 'coursePlan')
          .where('reservation.classTime >= :startDate', { startDate })
          .andWhere('reservation.classTime <= :endDate', { endDate })
          .andWhere('reservation.reservationStatus != :canceledStatus', { 
            canceledStatus: ReservationStatus.CANCELED 
          })
          .getMany();

        console.log('Found reservations:', reservations.length);

        // Calculate quota amount manually
        for (const reservation of reservations) {
          for (const orderReservation of reservation.orderReservations || []) {
            const order = orderReservation.order;
            if (order && order.coursePlan && order.coursePlan.price) {
              const memberCount = (order.adultCount || 0) + (order.childCount || 0);
              quotaAmount += order.coursePlan.price * memberCount;
            }
          }
        }
      } catch (quotaError) {
        console.error('Error calculating quota:', quotaError);
        quotaAmount = 0;
      }

      console.log('Total quota amount:', quotaAmount, typeof quotaAmount);

      return {
        classesCount,
        quotaAmount: Number(quotaAmount) || 0,
      };
    } catch (error) {
      console.error('Error in getMonthStats:', error);
      return {
        classesCount: 0,
        quotaAmount: 0,
      };
    }
  }

  async getAnnualCourseStats(year?: number) {
    try {
      const targetYear = year || new Date().getFullYear();
      
      // Get year start and end dates
      const yearStart = new Date(targetYear, 0, 1);
      const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59);

      console.log('Getting annual stats for year:', targetYear, 'from', yearStart, 'to', yearEnd);

      // Get all reservations for the year with related data
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.orderReservations', 'orderReservation')
        .leftJoinAndSelect('orderReservation.order', 'order')
        .leftJoinAndSelect('order.coursePlan', 'coursePlan')
        .where('reservation.classTime >= :yearStart', { yearStart })
        .andWhere('reservation.classTime <= :yearEnd', { yearEnd })
        .andWhere('reservation.reservationStatus != :canceledStatus', { 
          canceledStatus: ReservationStatus.CANCELED 
        })
        .getMany();

      // Categorize by course plan type
      const stats = {
        designated: 0, // 指定 - type 4 (一般私人課)
        booking: 0,    // 預約 - type 2,3 (固定堂數, 共用堂數)
        personal: 0,   // 個人練習 - need to identify
        experience: 0  // 單堂體驗 - type 1
      };

      for (const reservation of reservations) {
        for (const orderReservation of reservation.orderReservations || []) {
          const order = orderReservation.order;
          if (order && order.coursePlan) {
            const planType = order.coursePlan.type;
            
            switch (planType) {
              case 1: // 單堂體驗
                stats.experience++;
                break;
              case 2: // 固定堂數(每人)
              case 3: // 共用堂數
                stats.booking++;
                break;
              case 4: // 一般私人課
                stats.designated++;
                break;
              default:
                stats.personal++; // 其他類型歸類為個人練習
                break;
            }
          }
        }
      }

      const total = stats.designated + stats.booking + stats.personal + stats.experience;

      return {
        year: targetYear,
        total,
        stats: [
          { name: '指定', value: stats.designated, color: '#34C38F' },
          { name: '預約', value: stats.booking, color: '#F7B84B' },
          { name: '個人練習', value: stats.personal, color: '#F06548' },
          { name: '單堂體驗', value: stats.experience, color: '#50C3E6' }
        ]
      };
    } catch (error) {
      console.error('Error in getAnnualCourseStats:', error);
      return {
        year: new Date().getFullYear(),
        total: 0,
        stats: [
          { name: '指定', value: 0, color: '#34C38F' },
          { name: '預約', value: 0, color: '#F7B84B' },
          { name: '個人練習', value: 0, color: '#F06548' },
          { name: '單堂體驗', value: 0, color: '#50C3E6' }
        ]
      };
    }
  }

  async getDepartmentPerformance(year?: number) {
    try {
      const targetYear = year || new Date().getFullYear();
      
      // Initialize monthly data for each department
      const departments = ['台中店', '新竹店', '高雄店'];
      const monthlyData: { [key: string]: number[] } = {};
      
      departments.forEach(dept => {
        monthlyData[dept] = new Array(12).fill(0);
      });

      // Get data for each month
      for (let month = 1; month <= 12; month++) {
        const monthStart = new Date(targetYear, month - 1, 1);
        const monthEnd = new Date(targetYear, month, 0, 23, 59, 59);

        // Get reservations with department information
        const reservations = await this.reservationRepository
          .createQueryBuilder('reservation')
          .leftJoinAndSelect('reservation.department', 'department')
          .leftJoinAndSelect('reservation.orderReservations', 'orderReservation')
          .leftJoinAndSelect('orderReservation.order', 'order')
          .leftJoinAndSelect('order.coursePlan', 'coursePlan')
          .where('reservation.classTime >= :monthStart', { monthStart })
          .andWhere('reservation.classTime <= :monthEnd', { monthEnd })
          .andWhere('reservation.reservationStatus != :canceledStatus', { 
            canceledStatus: ReservationStatus.CANCELED 
          })
          .getMany();

        // Calculate revenue by department
        for (const reservation of reservations) {
          const departmentName = reservation.department?.name;
          if (departmentName && departments.includes(departmentName)) {
            for (const orderReservation of reservation.orderReservations || []) {
              const order = orderReservation.order;
              if (order && order.coursePlan && order.coursePlan.price) {
                const memberCount = (order.adultCount || 0) + (order.childCount || 0);
                const revenue = order.coursePlan.price * memberCount;
                monthlyData[departmentName][month - 1] += revenue;
              }
            }
          }
        }
      }

      return {
        year: targetYear,
        departments,
        monthlyData,
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      };
    } catch (error) {
      console.error('Error in getDepartmentPerformance:', error);
      return {
        year: new Date().getFullYear(),
        departments: ['台中店', '新竹店', '高雄店'],
        monthlyData: {
          '台中店': new Array(12).fill(0),
          '新竹店': new Array(12).fill(0),
          '高雄店': new Array(12).fill(0)
        },
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      };
    }
  }

  async exportGroupList(res: Response) {
    try {
      // Get reservations with available spaces (group classes with remaining capacity)
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.department', 'department')
        .leftJoinAndSelect('reservation.course', 'course')
        .leftJoinAndSelect('reservation.orderReservations', 'orderReservation')
        .leftJoinAndSelect('orderReservation.order', 'order')
        .leftJoinAndSelect('order.coursePlan', 'coursePlan')
        .where('reservation.reservationStatus = :status', { 
          status: ReservationStatus.SCHEDULED 
        })
        .getMany();

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('湊班名單');

      // Add headers
      worksheet.columns = [
        { header: '課程名稱', key: 'courseName', width: 20 },
        { header: '上課時間', key: 'classTime', width: 20 },
        { header: '地點', key: 'department', width: 15 },
        { header: '最大容量', key: 'maxCapacity', width: 10 },
        { header: '目前人數', key: 'currentCapacity', width: 10 },
        { header: '剩餘名額', key: 'remaining', width: 10 },
        { header: '價格', key: 'price', width: 15 }
      ];

      // Add data
      reservations.forEach(reservation => {
        const coursePlan = reservation.orderReservations?.[0]?.order?.coursePlan;
        const course = coursePlan?.course;
        const memberCount = reservation.reservationMembers?.length || 0;
        worksheet.addRow({
          courseName: course?.name || coursePlan?.name || '未指定',
          classTime: reservation.classTime?.toLocaleString() || '',
          department: reservation.department?.name || '未指定',
          maxCapacity: 10, // 假設最大容量為 10，實際應根據業務邏輯調整
          currentCapacity: memberCount,
          remaining: Math.max(0, 10 - memberCount),
          price: coursePlan?.price || 0
        });
      });

      // Style the headers
      worksheet.getRow(1).font = { bold: true };

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="group-list-${new Date().toISOString().split('T')[0]}.xlsx"`
      );

      // Send the file
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting group list:', error);
      throw error;
    }
  }

  async exportInstructorSchedule(res: Response, year?: number, month?: number) {
    try {
      const currentDate = new Date();
      const targetYear = year || currentDate.getFullYear();
      const targetMonth = month || currentDate.getMonth() + 1;
      
      // Calculate start and end dates for the target month
      const monthStart = new Date(targetYear, targetMonth - 1, 1);
      const monthEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59);

      // Get all reservations with instructor information for the specified month
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.department', 'department')
        .leftJoinAndSelect('reservation.orderReservations', 'orderReservation')
        .leftJoinAndSelect('orderReservation.order', 'order')
        .leftJoinAndSelect('order.coursePlan', 'coursePlan')
        .leftJoinAndSelect('coursePlan.course', 'course')
        .where('reservation.reservationStatus != :canceledStatus', { 
          canceledStatus: ReservationStatus.CANCELED 
        })
        .andWhere('reservation.classTime >= :monthStart', { monthStart })
        .andWhere('reservation.classTime <= :monthEnd', { monthEnd })
        .orderBy('instructor.username', 'ASC')
        .addOrderBy('reservation.classTime', 'ASC')
        .getMany();

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('教練總排堂表');

      // Add headers
      worksheet.columns = [
        { header: '教練姓名', key: 'instructorName', width: 15 },
        { header: '課程名稱', key: 'courseName', width: 20 },
        { header: '上課時間', key: 'classTime', width: 20 },
        { header: '地點', key: 'department', width: 15 },
        { header: '課程類型', key: 'courseType', width: 15 },
        { header: '學員人數', key: 'studentCount', width: 10 },
        { header: '課程時長', key: 'duration', width: 10 },
        { header: '狀態', key: 'status', width: 10 }
      ];

      // Add data
      reservations.forEach(reservation => {
        const coursePlan = reservation.orderReservations?.[0]?.order?.coursePlan;
        const course = coursePlan?.course;
        const memberCount = reservation.reservationMembers?.length || 0;
        
        worksheet.addRow({
          instructorName: reservation.instructor || '未指定',
          courseName: course?.name || coursePlan?.name || '未指定',
          classTime: reservation.classTime?.toLocaleString() || '',
          department: reservation.department?.name || '未指定',
          courseType: this.getCourseTypeText(coursePlan?.type),
          studentCount: memberCount,
          duration: coursePlan?.number || 0,
          status: this.getStatusText(reservation.reservationStatus)
        });
      });

      // Style the headers
      worksheet.getRow(1).font = { bold: true };

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="instructor-schedule-${targetYear}-${targetMonth.toString().padStart(2, '0')}.xlsx"`
      );

      // Send the file
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting instructor schedule:', error);
      throw error;
    }
  }

  private getCourseTypeText(type?: number): string {
    switch (type) {
      case 1: return '單堂體驗';
      case 2: return '固定堂數';
      case 3: return '共用堂數';
      case 4: return '一般私人課';
      default: return '其他';
    }
  }

  private getStatusText(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.SCHEDULED: return '已排定';
      case ReservationStatus.PENDING_REVIEW: return '待紀錄';
      case ReservationStatus.COMPLETED: return '已完成';
      case ReservationStatus.CANCELED: return '已取消';
      default: return '未知';
    }
  }

  async exportCoachScheduleSummary(res: Response, year?: number, month?: number) {
    try {
      const currentDate = new Date();
      const targetYear = year || currentDate.getFullYear();
      const targetMonth = month || currentDate.getMonth() + 1;

      // Calculate start and end dates for the target month
      const monthStart = new Date(targetYear, targetMonth - 1, 1);
      const monthEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59);

      console.log('Exporting coach schedule summary for:', targetYear, targetMonth);

      // Query all reservations for the month with order information
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.orderReservations', 'orderReservation')
        .leftJoinAndSelect('orderReservation.order', 'order')
        .where('reservation.classTime >= :monthStart', { monthStart })
        .andWhere('reservation.classTime <= :monthEnd', { monthEnd })
        .andWhere('reservation.reservationStatus IN (:...statuses)', {
          statuses: [ReservationStatus.SCHEDULED, ReservationStatus.COMPLETED]
        })
        .andWhere('reservation.instructor IS NOT NULL')
        .orderBy('reservation.instructor', 'ASC')
        .addOrderBy('reservation.classTime', 'ASC')
        .getMany();

      console.log('Found reservations:', reservations.length);

      // Group by instructor and calculate stats
      interface CoachStats {
        instructorName: string;
        totalSessions: number;
        designatedSessions: number;
        designatedDates: Date[];
      }

      const coachMap = new Map<string, CoachStats>();

      for (const reservation of reservations) {
        const instructor = reservation.instructor;

        if (!coachMap.has(instructor)) {
          coachMap.set(instructor, {
            instructorName: instructor,
            totalSessions: 0,
            designatedSessions: 0,
            designatedDates: [],
          });
        }

        const stats = coachMap.get(instructor)!;
        stats.totalSessions++;

        // Check if this reservation is from a designated order (bkgType = 2)
        let isDesignated = false;
        for (const orderReservation of reservation.orderReservations || []) {
          if (orderReservation.order && orderReservation.order.bkgType === 2) {
            isDesignated = true;
            break;
          }
        }

        if (isDesignated) {
          stats.designatedSessions++;
          stats.designatedDates.push(reservation.classTime);
        }
      }

      const coachStats = Array.from(coachMap.values());

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('教練總排堂表');

      // Define columns
      worksheet.columns = [
        { header: '教練姓名', key: 'instructorName', width: 20 },
        { header: '總堂數', key: 'totalSessions', width: 12 },
        { header: '指定', key: 'designatedSessions', width: 12 },
        { header: '指定日期', key: 'designatedDates', width: 50 },
      ];

      // Add data rows
      coachStats.forEach(coach => {
        worksheet.addRow({
          instructorName: coach.instructorName,
          totalSessions: coach.totalSessions,
          designatedSessions: coach.designatedSessions,
          designatedDates: coach.designatedDates
            .map(date => new Date(date).toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }))
            .join(', '),
        });
      });

      // Add summary row
      const totalSessions = coachStats.reduce((sum, coach) => sum + coach.totalSessions, 0);
      const totalDesignated = coachStats.reduce((sum, coach) => sum + coach.designatedSessions, 0);

      const summaryRow = worksheet.addRow({
        instructorName: '合計',
        totalSessions: totalSessions,
        designatedSessions: totalDesignated,
        designatedDates: '',
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };

      // Style summary row
      summaryRow.font = { bold: true };
      summaryRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF2CC' },
      };

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="coach-schedule-summary-${targetYear}-${targetMonth.toString().padStart(2, '0')}.xlsx"`
      );

      // Send file
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting coach schedule summary:', error);
      throw error;
    }
  }

  async exportOrderClassList(res: Response) {
    try {
      // Helper function for date formatting
      const formatDate = (date: Date | null): string => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      };

      // STEP 1: Query orders with members and reservations
      // Filter: Group course (type='G') and Flexible booking (bkgType=1)
      const ordersWithMembers = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderMembers', 'orderMember')
        .leftJoinAndSelect('orderMember.member', 'member')
        .leftJoinAndSelect('order.orderReservations', 'orderReservation')
        .leftJoinAndSelect('orderReservation.reservation', 'reservation')
        .where('orderMember.active = :active', { active: true })
        .andWhere('order.type = :courseType', { courseType: 'G' }) // Group course only
        .andWhere('order.bkgType = :bkgType', { bkgType: 1 }) // Flexible booking only
        .andWhere('order.skiType IN (:...skiTypes)', { skiTypes: [1, 2] }) // Exclude BOTH (0)
        .getMany();

      // STEP 2: Filter orders by criteria
      const filteredOrders = ordersWithMembers.filter(order => {
        const totalParticipants = (order.adultCount || 0) + (order.childCount || 0);
        if (totalParticipants > 2 || totalParticipants === 0) return false;

        const validReservations = order.orderReservations.filter(
          or => or.reservation?.reservationStatus !== ReservationStatus.CANCELED
        );
        const remainingSlots = order.planNumber - validReservations.length;
        return remainingSlots > 0;
      });

      // STEP 3: Collect orderMember IDs and query class history
      const orderMemberIds = filteredOrders.flatMap(order =>
        order.orderMembers.map(om => om.id)
      );

      // Handle empty result case
      if (orderMemberIds.length === 0) {
        // Create empty Excel file
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('湊班名單');
        worksheet.columns = [
          { header: '板類', key: 'boardType', width: 10 },
          { header: '人數', key: 'participantCount', width: 10 },
          { header: '姓名', key: 'customerName', width: 20 },
          { header: 'Line ID', key: 'lineId', width: 25 },
          { header: '會員備註', key: 'memberNotes', width: 30 },
          { header: '最新上課紀錄', key: 'latestClass', width: 20 },
        ];
        worksheet.getRow(1).font = { bold: true };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition',
          `attachment; filename="order-class-list-${new Date().toISOString().split('T')[0]}.xlsx"`
        );
        await workbook.xlsx.write(res);
        res.end();
        return;
      }

      const classHistoryRecords = await this.reservationMemberRepository
        .createQueryBuilder('rm')
        .leftJoinAndSelect('rm.reservation', 'reservation')
        .where('rm.orderMemberId IN (:...orderMemberIds)', { orderMemberIds })
        .andWhere('rm.attended = :attended', { attended: true })
        .andWhere('reservation.reservationStatus = :status', {
          status: ReservationStatus.COMPLETED
        })
        .orderBy('reservation.classTime', 'DESC')
        .getMany();

      // STEP 4: Group history by member
      const historyByMember = classHistoryRecords.reduce((acc, rm) => {
        if (!acc[rm.orderMemberId]) acc[rm.orderMemberId] = [];
        acc[rm.orderMemberId].push(rm.reservation.classTime);
        return acc;
      }, {} as Record<string, Date[]>);

      // STEP 5: Transform to data rows
      const dataRows = filteredOrders.flatMap(order =>
        order.orderMembers.map(om => {
          const history = historyByMember[om.id] || [];
          const row: any = {
            boardType: order.skiType === 1 ? 'SB' : 'SKI',
            participantCount: (order.adultCount || 0) + (order.childCount || 0),
            customerName: om.member.name,
            lineId: om.member.lineId || '',
            memberNotes: om.member.note || '',
            latestClass: history.length > 0 ? formatDate(history[0]) : ''
          };

          // Add history columns dynamically
          history.forEach((classDate, idx) => {
            row[`classHistory${idx + 1}`] = formatDate(classDate);
          });

          return row;
        })
      );

      // STEP 6: Sort data
      dataRows.sort((a, b) => {
        const boardCompare = (a.boardType === 'SB' ? 1 : 2) - (b.boardType === 'SB' ? 1 : 2);
        if (boardCompare !== 0) return boardCompare;

        const countCompare = b.participantCount - a.participantCount;
        if (countCompare !== 0) return countCompare;

        return a.customerName.localeCompare(b.customerName, 'zh-TW');
      });

      // STEP 7: Determine max history columns
      const maxHistoryCount = Math.max(...dataRows.map(row =>
        Object.keys(row).filter(k => k.startsWith('classHistory')).length
      ), 0);

      // STEP 8: Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('湊班名單');

      // STEP 9: Build dynamic columns
      const columns: any[] = [
        { header: '板類', key: 'boardType', width: 10 },
        { header: '人數', key: 'participantCount', width: 10 },
        { header: '姓名', key: 'customerName', width: 20 },
        { header: 'Line ID', key: 'lineId', width: 25 },
        { header: '會員備註', key: 'memberNotes', width: 30 },
        { header: '最新上課紀錄', key: 'latestClass', width: 20 },
      ];

      for (let i = 1; i <= maxHistoryCount; i++) {
        columns.push({ header: i.toString(), key: `classHistory${i}`, width: 15 });
      }

      worksheet.columns = columns;

      // STEP 10: Add rows
      dataRows.forEach(row => worksheet.addRow(row));

      // STEP 11: Style headers
      worksheet.getRow(1).font = { bold: true };

      // STEP 12: Set response headers and send
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition',
        `attachment; filename="order-class-list-${new Date().toISOString().split('T')[0]}.xlsx"`
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting order class list:', error);
      throw error;
    }
  }
}