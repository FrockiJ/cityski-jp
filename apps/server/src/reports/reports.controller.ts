import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';

export interface MonthlyStatsResponse {
  classesCount: number;
  quotaAmount: number;
  classesGrowthRate: number | null;
  quotaGrowthRate: number | null;
}

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {
    console.log('ReportsController initialized');
  }

  @UseGuards(AuthGuard)
  @Get('monthly-stats')
  async getMonthlyStats(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<MonthlyStatsResponse> {
    console.log('GET /reports/monthly-stats called with:', { year, month });
    try {
      const result = await this.reportsService.getMonthlyStats(year, month);
      console.log('Service returned:', result);
      return result;
    } catch (error) {
      console.error('Error in getMonthlyStats controller:', error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('annual-course-stats')
  async getAnnualCourseStats(
    @Query('year') year?: number,
  ) {
    console.log('GET /reports/annual-course-stats called with:', { year });
    try {
      const result = await this.reportsService.getAnnualCourseStats(year);
      console.log('Annual course stats returned:', result);
      return result;
    } catch (error) {
      console.error('Error in getAnnualCourseStats controller:', error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('department-performance')
  async getDepartmentPerformance(
    @Query('year') year?: number,
  ) {
    console.log('GET /reports/department-performance called with:', { year });
    try {
      const result = await this.reportsService.getDepartmentPerformance(year);
      console.log('Department performance returned:', result);
      return result;
    } catch (error) {
      console.error('Error in getDepartmentPerformance controller:', error);
      throw error;
    }
  }
}