import { HttpStatus, Injectable } from '@nestjs/common';
import { CoursePlanSession } from './entities/course-plan-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateCoursePlanSessionRequestDto } from '@repo/shared';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { CustomException } from 'src/common/exception/custom.exception';

@Injectable()
export class CoursePlanSessionService {
  constructor(
    @InjectRepository(CoursePlanSession)
    private readonly coursePlanSessionRepository: Repository<CoursePlanSession>,
  ) {}

  /**
   * Create a course plan session for a course plan by User Id.
   **/
  async create(
    userId: string,
    coursePlan: CoursePlan,
    createDtos: CreateCoursePlanSessionRequestDto[],
    queryRunner: QueryRunner,
  ) {
    try {
      const saveSessions = createDtos.map((session) =>
        this.coursePlanSessionRepository.create({
          createdUser: userId,
          updatedUser: userId,
          ...session,
          plan: { id: coursePlan.id },
        }),
      );
      console.log('saveSessions', saveSessions);
      await queryRunner.manager.save(saveSessions);
    } catch (err) {
      throw new CustomException(
        `Error when attempting to create a course plan session: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a course plan session for a course plan by User Id.
   **/
  async update(
    userId: string,
    coursePlan: CoursePlan,
    createDtos: CreateCoursePlanSessionRequestDto[],
    queryRunner: QueryRunner,
  ) {
    try {
      const dbCourseSessions = await queryRunner.manager.find(
        CoursePlanSession,
        {
          where: { plan: { id: coursePlan.id } },
          relations: ['plan'],
        },
      );

      const updateCoursePlanSessionIds = createDtos.map((people) => people.id);
      const deleteCourselanSessions = dbCourseSessions.filter(
        (row) => !updateCoursePlanSessionIds.includes(row.id),
      );

      if (deleteCourselanSessions.length > 0) {
        await queryRunner.manager.remove(
          CoursePlanSession,
          deleteCourselanSessions,
        );
      }

      const saveSessions = createDtos.map((session) =>
        this.coursePlanSessionRepository.create({
          updatedUser: userId,
          updatedTime: new Date(),
          ...(!session.id && { createdUser: userId }),
          ...session,
          plan: { id: coursePlan.id },
        }),
      );

      await queryRunner.manager.save(saveSessions);
    } catch (err) {
      throw new CustomException(
        `Error when attempting to create a course plan session: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
