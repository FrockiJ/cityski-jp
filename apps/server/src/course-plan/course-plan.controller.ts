import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CoursePlanService } from './course-plan.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('course-plan')
export class CoursePlanController {
  constructor(private readonly coursePlanService: CoursePlanService) {}

  /********************************************
   *              -- ADMIN  --                *
   ********************************************/

  /**
   * Get all course plans for a member.
   **/
  // @UseGuards(AuthGuard)
  // @Get()
  // getCoursePlansByCourseId(@Body() requestDto: GetCoursePlanRequestDto) {
  //   console.log('requestDto:', requestDto);
  //   return this.coursePlanService.getCoursePlansByCourseId(requestDto);
  // }
  @UseGuards(AuthGuard)
  @Get('/:id')
  getCoursePlansByCourseId(@Param() id: string) {
    return this.coursePlanService.getCoursePlansByCourseId(id);
  }

  /**
   * Get a single course plan for a course by Id.
   **/
  @UseGuards(AuthGuard)
  @Get('/:id')
  getCoursePlanById(@Param() id: string) {
    return this.coursePlanService.getCoursePlanById(id);
  }
}
