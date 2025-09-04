import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetDepartmentsResponseDTO } from '@repo/shared';

@Controller('/departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  getDepartments(): Promise<GetDepartmentsResponseDTO[]> {
    return this.departmentsService.getDepartment();
  }

  @UseGuards(AuthGuard)
  @Get('/venues')
  getVenues(): Promise<any> {
    return this.departmentsService.getVenues();
  }

  @UseGuards(AuthGuard)
  @Post('/venue')
  createVenue(@Body() body): Promise<any> {
    return this.departmentsService.createVenue(body);
  }

  /********************************************
   *              -- CLIENT --                *
   ********************************************/

  @Get('/client')
  getDepartmentsForClient(): Promise<GetDepartmentsResponseDTO[]> {
    return this.departmentsService.getDepartmentsForClient();
  }
}
