import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';

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

  @UseGuards(AuthGuard)
  @Get('export/group-list')
  async exportGroupList(@Res() res: Response) {
    console.log('GET /reports/export/group-list called');
    try {
      await this.reportsService.exportGroupList(res);
    } catch (error) {
      console.error('Error in exportGroupList controller:', error);
      res.status(500).json({ error: 'Failed to export group list' });
    }
  }

  @UseGuards(AuthGuard)
  @Get('export/instructor-schedule')
  async exportInstructorSchedule(
    @Res() res: Response,
    @Query('year') year?: number,
    @Query('month') month?: number
  ) {
    console.log('GET /reports/export/instructor-schedule called with:', { year, month });
    try {
      await this.reportsService.exportInstructorSchedule(res, year, month);
    } catch (error) {
      console.error('Error in exportInstructorSchedule controller:', error);
      res.status(500).json({ error: 'Failed to export instructor schedule' });
    }
  }
}