import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CoursesService } from './courses.service';
import {
  CourseStatusType,
  CreateCourseRequestDTO,
  CreateDraftCourseRequestDTO,
  GetClientCoursesResponseDTO,
  GetCourseDetailResponseDTO,
  GetCourseManagementVenuesResponseDTO,
  GetCoursesRequestDTO,
  GetCoursesResponseDTO,
  GetPublishedCoursesResponseDTO,
  ResWithPaginationDTO,
  UpdateCourseManagementVenuesRequestDTO,
  UpdateCourseRequestDTO,
  UpdateDraftCourseRequestDTO,
  UpdatePublishedCoursesSortingRequestDTO,
} from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';

@Controller('/courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  getCourses(
    @Query() request: GetCoursesRequestDTO,
  ): Promise<ResWithPaginationDTO<GetCoursesResponseDTO[]>> {
    return this.coursesService.getCourses(request);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  createCourse(
    @Body() body: CreateCourseRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.coursesService.createCourse(
      userId,
      body,
      CourseStatusType.PUBLISHED,
    );
  }

  @Patch('/')
  @UseGuards(AuthGuard)
  updateCourse(
    @Body() body: UpdateCourseRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.coursesService.updateCourse(
      userId,
      body,
      CourseStatusType.PUBLISHED,
    );
  }

  // cron test course published
  // @Get('/schedule-published')
  // @UseGuards(AuthGuard)
  // schedulePublished() {
  //   return this.coursesService.schedulePublished();
  // }

  // cron test course unpublished
  // @Get('/schedule-unpublished')
  // @UseGuards(AuthGuard)
  // scheduleUnpublished() {
  //   return this.coursesService.scheduleUnpublished();
  // }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getCourseDetail(
    @Param('id') id: string,
  ): Promise<GetCourseDetailResponseDTO> {
    return this.coursesService.getCourseDetail(id);
  }

  @Post('/draft')
  @UseGuards(AuthGuard)
  createDraftCourse(
    @Body() body: CreateDraftCourseRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.coursesService.createCourse(
      userId,
      body,
      CourseStatusType.DRAFT,
    );
  }

  @Patch('/draft')
  @UseGuards(AuthGuard)
  updateDraftCourse(
    @Body() body: UpdateDraftCourseRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.coursesService.updateCourse(
      userId,
      body,
      CourseStatusType.DRAFT,
    );
  }

  // scheduling back to draft
  @Patch('/:id/revert')
  @UseGuards(AuthGuard)
  revertCourse(@Param('id') id: string, @Req() request: CustomRequest) {
    const userId = request['user'].sub;
    return this.coursesService.revertCourse(userId, id);
  }
  // delete draft
  @Delete('/:id/delete')
  @UseGuards(AuthGuard)
  deleteCourse(@Param('id') id: string) {
    console.log('delete id', id);
    return this.coursesService.deleteCourse(id);
  }
  // unpublished course
  @Patch('/:id/unpublished')
  @UseGuards(AuthGuard)
  unpublishedCourse(@Param('id') id: string, @Req() request: CustomRequest) {
    const userId = request['user'].sub;
    console.log('unpublished id', id);
    return this.coursesService.unpublishedCourse(userId, id);
  }

  @Get('/:id/manage-published-courses')
  @UseGuards(AuthGuard)
  managePublishedCourses(
    @Param('id') departmentId: string,
  ): Promise<GetPublishedCoursesResponseDTO[]> {
    return this.coursesService.getPublishedCourses(departmentId);
  }

  @Patch('/manage-published-courses/sort')
  @UseGuards(AuthGuard)
  updateManagePublishedCourseWithSorting(
    @Body() body: UpdatePublishedCoursesSortingRequestDTO,
  ) {
    return this.coursesService.updatePublishedCoursesSorting(body);
  }

  @Get('/:id/course-management-venues')
  @UseGuards(AuthGuard)
  getCourseManagementVenues(
    @Param('id') departmentId: string,
  ): Promise<GetCourseManagementVenuesResponseDTO> {
    return this.coursesService.getCourseManagementVenues(departmentId);
  }

  @Patch('/course-management-venues')
  @UseGuards(AuthGuard)
  updateVenuesByDepartment(
    @Body() body: UpdateCourseManagementVenuesRequestDTO[],
    @Req() request: CustomRequest,
  ) {
    const userId = request['user'].sub;
    return this.coursesService.updateCourseManagementVenues(body, userId);
  }

  /********************************************
   *              -- CLIENT --                *
   ********************************************/

  @Get('/:id/client')
  // @UseGuards(AuthGuard)
  getClientCourses(
    @Param('id') id: string,
  ): Promise<GetClientCoursesResponseDTO[]> {
    return this.coursesService.getCoursesForClient(id);
  }

  @Get('/client/:id/detail')
  // @UseGuards(AuthGuard)
  getClientCourseDetail(
    @Param('id') id: string,
  ): Promise<GetCourseDetailResponseDTO> {
    return this.coursesService.getClientCourseDetail(id);
  }
}
