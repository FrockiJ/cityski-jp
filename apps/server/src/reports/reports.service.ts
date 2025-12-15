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

      // Get current month data
      const currentStats = await this.getMonthStats(currentMonthStart, currentMonthEnd);
      
      // Get last year same month data
      const lastYearStats = await this.getMonthStats(lastYearStart, lastYearEnd);

      // Calculate growth rates
      const classesGrowthRate = lastYearStats.classesCount === 0 
        ? 0 
        : ((currentStats.classesCount - lastYearStats.classesCount) / lastYearStats.classesCount) * 100;
      
      const quotaGrowthRate = lastYearStats.quotaAmount === 0 
        ? 0 
        : ((currentStats.quotaAmount - lastYearStats.quotaAmount) / lastYearStats.quotaAmount) * 100;

      return {
        classesCount: currentStats.classesCount,
        quotaAmount: currentStats.quotaAmount,
        classesGrowthRate: Math.round(classesGrowthRate * 10) / 10, // Round to 1 decimal place
        quotaGrowthRate: Math.round(quotaGrowthRate * 10) / 10, // Round to 1 decimal place
      };
    } catch (error) {
      console.error('Error in getMonthlyStats:', error);
      // Return default values on error
      return {
        classesCount: 0,
        quotaAmount: 0,
        classesGrowthRate: 0,
        quotaGrowthRate: 0,
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

      console.log('Total quota amount:', quotaAmount);

      return {
        classesCount,
        quotaAmount,
      };
    } catch (error) {
      console.error('Error in getMonthStats:', error);
      return {
        classesCount: 0,
        quotaAmount: 0,
      };
    }
  }
}