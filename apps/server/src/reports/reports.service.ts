import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from 'src/reservations/entities/reservation.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(OrderReservation)
    private orderReservationRepository: Repository<OrderReservation>,
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
}