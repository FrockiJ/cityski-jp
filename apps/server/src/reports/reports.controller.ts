import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';

export interface MonthlyStatsResponse {
  classesCount: number;
  quotaAmount: number;
  classesGrowthRate: number;
  quotaGrowthRate: number;
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
}