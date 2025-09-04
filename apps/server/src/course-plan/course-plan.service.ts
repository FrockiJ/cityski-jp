import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursePlan } from './entities/course-plan.entity';
import { QueryRunner, Repository } from 'typeorm';
import {
  CreateCoursePlanRequestDto,
  CourseBkgType,
  CoursePlanType,
  CourseType,
  CreateCoursePlanSessionRequestDto,
  Department,
} from '@repo/shared';
import { CustomException } from 'src/common/exception/custom.exception';
import { Course } from 'src/course/entities/course.entity';
import { CoursePlanSessionService } from 'src/course-plan-session/course-plan-session.service';
import { DepartmentVenue } from 'src/departments/entities/department-venue.entity';
import { CoursePlanSession } from 'src/course-plan-session/entities/course-plan-session.entity';

@Injectable()
export class CoursePlanService {
  constructor(
    private readonly coursePlanSessionService: CoursePlanSessionService,
    @InjectRepository(CoursePlan)
    private readonly coursePlanRepository: Repository<CoursePlan>,
    @InjectRepository(CoursePlanSession)
    private readonly coursePlanSessionRepository: Repository<CoursePlanSession>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(DepartmentVenue)
    private readonly departmentVenueRepository: Repository<DepartmentVenue>,
  ) {}

  /**
   * Get a single course plan for a course by Id.
   **/
  async getCoursePlanById(id: string) {
    try {
      return await this.coursePlanRepository.findOneBy({
        id,
      });
    } catch (err) {
      throw new CustomException(
        `Error when attempting to query for the course plan with id: ${id}, error: ${err}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get all course plans for a course by Id.
   **/
  async getCoursePlansByCourseId(courseId: string): Promise<CoursePlan[]> {
    try {
      return await this.coursePlanRepository.find({
        where: {
          course: {
            id: courseId,
          },
        },
      });
    } catch (err) {
      throw new CustomException(
        `Error when attempting to query for course plans with courseId: ${courseId}, error: ${err}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DRAFT OF DRAFT
  // async createCoursePlanDraft(
  //   userId: string,
  //   courseId: string,
  //   requestDto: CreateCoursePlanRequestDto,
  //   course: Course,
  //   queryRunner: QueryRunner,
  // ) {
  //   const coursePlan = this.coursePlanRepository.create(requestDto);
  //   const coursePlanObj = await queryRunner.manager.save(coursePlan);
  //
  //   if (requestDto.sessions) {
  //     this.coursePlanSessionService.create();
  //   }
  // }

  /**
   * Creates a course plan a course by course id.
   **/
  async createCoursePlan(
    userId: string,
    courseId: string,
    requestDto: CreateCoursePlanRequestDto,
    course: Course,
    queryRunner: QueryRunner,
  ) {
    try {
      if (!course) {
        throw new CustomException(
          `Course Plan could not be created as course id in payload was ${courseId} and does not exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // --- Course Booking Type = 預約 / FLEXIBLE ---

      if (course.bkgType === CourseBkgType.FLEXIBLE) {
        // -- combinations needing one or more sessions --

        if (
          // Course Type: GROUP / 團體
          (course.type === CourseType.GROUP &&
            requestDto.type === CoursePlanType.SINGLE_SESSION) ||
          (course.type === CourseType.GROUP &&
            requestDto.type === CoursePlanType.FIXED_SESSION) ||
          (course.type === CourseType.GROUP &&
            requestDto.type === CoursePlanType.SHARED_GROUP) ||
          // PRIVATE / 私人
          (course.type === CourseType.PRIVATE &&
            requestDto.type === CoursePlanType.PRIVATE_SESSION)
        ) {
          if (requestDto.number < 1) {
            throw new CustomException(
              'number field must be filled and greater than 1.',
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        // -- combinations require 1 fixed session --
        if (
          course.type === CourseType.INDIVIDUAL ||
          (course.type === CourseType.PRIVATE &&
            requestDto.type === CoursePlanType.SINGLE_SESSION)
        ) {
          requestDto.number = 1;
        }

        // if course type is Flexible and not fixed (course.bkg_type != 2), must NOT have sessions in the payload (DTO)
        if (requestDto.sessions?.length) {
          throw new CustomException(
            'Sessions field is only for courses with booking type (bkg_type) 2 (fixed).',
            HttpStatus.BAD_REQUEST,
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sessions, ...others } = requestDto;

        const newCoursePlan = this.coursePlanRepository.create({
          ...others,
          course: { id: courseId },
          createdUser: userId,
          updatedUser: userId,
        });
        return await queryRunner.manager.save(newCoursePlan);
      }

      // --- Course Type: 指定 / FIXED ---

      if (course.bkgType === CourseBkgType.FIXED) {
        // don't allow number of sessions to be less than 1

        if (requestDto.number < 1) {
          throw new CustomException(
            'number field must be filled and greater than 1 when bkg_type type (booking type) is 2 (fixed).',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!requestDto.sessions?.length) {
          throw new CustomException(
            'Sessions are required bkg_type type (booking type) is 2 (fixed).',
            HttpStatus.BAD_REQUEST,
          );
        }

        // -- venue availability checks --
        // validate if venue is available based on the provided request data
        this.validateAndGetAvailabilities(course, requestDto.sessions);

        // TODO: remove after testing
        // return;

        // Need venue repository and check:
        // DEPT_VENUE.status === 1 (active)
        // DEPT_VENUE.open_start_time and open_end_time

        // For each session in sessions array:
        // - Validate startTime and endTime are same day
        // - (endTime - startTime) === course.length
        // - Check DEPT_VENUE_SCHEDULE for conflicts
        //
        // join relation between course dept_id and department id to find
        // the corresponding department

        const { sessions, ...others } = requestDto;

        const newCoursePlan = this.coursePlanRepository.create({
          ...others,
          course: { id: courseId },
          createdUser: userId,
          updatedUser: userId,
        });

        // save to create ID first
        const savedCoursePlan = await queryRunner.manager.save(newCoursePlan);

        // create sessions with course ID
        await this.coursePlanSessionService.create(
          userId,
          savedCoursePlan,
          sessions,
          queryRunner,
        );

        // count max number of course plan sessions for number of machinese
      }
    } catch (err) {
      throw new CustomException(
        `Course plan could not be created. Error: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Queries all relevant course plan sessions under a course plan and deduces all the
   * remaining availablities based on department venue settings, course venue settings,
   * and other existing course plan sessions.
   **/
  async validateAndGetAvailabilities(
    course: Course,
    coursePlanSessions: CreateCoursePlanSessionRequestDto[],
  ) {
    console.log('@Availability Check ', { coursePlanSessions });

    // dynamically generate course type portion of the query based on course "type" field
    let courseTypeString: keyof typeof courseTypeObject;

    const courseTypeObject = {
      group: {
        group: true,
      },
      individual: {
        individual: true,
      },
      private: {
        private: true,
      },
    };

    switch (course.type) {
      case CourseType.GROUP: {
        courseTypeString = 'group';
        break;
      }
      case CourseType.INDIVIDUAL: {
        courseTypeString = 'individual';
        break;
      }
      case CourseType.PRIVATE: {
        courseTypeString = 'private';
        break;
      }
    }

    const courseTypeQuery = `course_venue.${courseTypeString} = :${courseTypeString}`;

    // determine max count by checking number of "active" department_venues with matching course
    // "type" to course_venue group / private / individual
    const { maxCount } = await this.departmentVenueRepository
      .createQueryBuilder('department_venue')
      .leftJoin('department_venue.courseVenue', 'course_venue')
      .where('department_venue.department_id = :departmentId', {
        departmentId: course.department.id,
      })
      .andWhere('department_venue.status = :status', { status: 1 })
      .andWhere(courseTypeQuery, courseTypeObject[courseTypeString])
      .select('COUNT(department_venue.id)', 'maxCount')
      .getRawOne();

    console.log(
      'course type dynamic query:',
      courseTypeQuery,
      courseTypeObject[courseTypeString],
    );

    console.log('max count of sessions:', maxCount);
    // determine max count by checking number of active departments
    // const departments = await this.departmentRepository.findAndCount();
    // console.log('count of departments:', departments);

    // get list of active venues for the current department
    const venueInfo: {
      starttime: string;
      endtime: string;
      status: boolean;
      individual: boolean;
      group: boolean;
      private: boolean;
      departmentid: string;
      departmentvenueid: string;
      coursevenueId: string;
    }[] = await this.departmentVenueRepository
      .createQueryBuilder('department_venue')
      .innerJoin('department_venue.department', 'department')
      .leftJoin('department_venue.courseVenue', 'course_venue')
      .select([
        'department_venue.openStartTime as startTime',
        'department_venue.openEndTime as endTime',
        'department_venue.status as status',
        'department_venue.id as departmentVenueId',
        'course_venue.individual as individual',
        'course_venue.group as group',
        'course_venue.private as private',
        'course_venue.id as courseVenueId',
        'department.id as departmentId',
      ])
      // only venues under this department
      .where('department.id = :departmentId', {
        departmentId: course.department.id,
      })
      // make sure venue is still active
      .andWhere('department_venue.status = 1')
      .getRawMany();

    // get list of existing sessions
    // const existingSessions = await this.coursePlanSessionRepository.find();

    console.log('@Availability Check: ', { venueInfo });

    // break down venue information into its 1 hour time slots
    const availabilities = Array.from(venueInfo, (venue) => {
      return {
        venueId: venue.departmentvenueid,
        startTime: venue.starttime,
        slotsOpen: 0,
        isFull: false,
      };
    });

    console.log('@Availability Check: ', { availabilities });
  }

  /**
   *
   * @param userId login user id
   * @param requestDtos client request body
   * @param course saved course data
   * @param queryRunner transaction
   */
  async update(
    userId: string,
    requestDtos: CreateCoursePlanRequestDto[],
    course: Course,
    queryRunner: QueryRunner,
  ) {
    const dbCoursePlans = await queryRunner.manager.find(CoursePlan, {
      where: { course: { id: course.id } },
      relations: ['course'],
    });

    const updateCoursePlanIds = requestDtos.map((people) => people.id);
    const deleteCoursePlans = dbCoursePlans.filter(
      (row) => !updateCoursePlanIds.includes(row.id),
    );

    if (deleteCoursePlans.length > 0) {
      await queryRunner.manager.remove(CoursePlan, deleteCoursePlans);
    }

    // update course plan
    if (requestDtos && requestDtos.length > 0) {
      for (const plan of requestDtos) {
        await this.updateCoursePlan(userId, plan, course, queryRunner);
      }
    }
  }

  /**
   *
   * @param userId login user id
   * @param requestDto client body
   * @param course saved update course data
   * @param queryRunner transaction
   */
  async updateCoursePlan(
    userId: string,
    requestDto: CreateCoursePlanRequestDto,
    course: Course,
    queryRunner: QueryRunner,
  ) {
    if (!course) {
      throw new CustomException(
        `Course Plan could not be created as course id in payload was ${course.id} and does not exist.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const courseBookingType = Number(course.bkgType);

    // if course.bkg_type = 2, must require plan to generate course_plan_sessions,
    // so sessions are required from the payload (DTO)
    if (
      courseBookingType === CourseBkgType.FIXED &&
      !requestDto.sessions?.length
    ) {
      throw new CustomException(
        'Sessions are required if course bkg_type is 2.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // if course.bkg_type != 2, must not have sessions in the payload
    if (
      courseBookingType === CourseBkgType.FLEXIBLE &&
      requestDto.sessions?.length
    ) {
      throw new CustomException(
        'Sessions field is only for courses with bkg_type 2.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const { sessions, ...others } = requestDto;
      const newCoursePlan = this.coursePlanRepository.create({
        ...others,
        course: { id: course.id },
        updatedTime: new Date(),
        updatedUser: userId,
        ...(!requestDto.id && { createdUser: userId }),
      });

      console.log('newCoursePlan', newCoursePlan);

      // save to create ID first
      const savedCoursePlan = await queryRunner.manager.save(newCoursePlan);

      // if course.bkg type = 2 and sessions are correctly provided
      if (courseBookingType === CourseBkgType.FIXED) {
        await this.coursePlanSessionService.update(
          userId,
          savedCoursePlan,
          sessions,
          queryRunner,
        );
      }
    } catch (err) {
      throw new CustomException(
        `Course plan could not be created. Error: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
