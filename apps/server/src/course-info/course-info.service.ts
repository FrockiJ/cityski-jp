import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CourseInfo as CourseInfoEntity } from 'src/course-info/entities/course-info.entity';
import { CourseInfo, DraftCourseInfo } from '@repo/shared';

@Injectable()
export class CourseInfoService {
  constructor(
    @InjectRepository(CourseInfoEntity)
    private readonly courseInfoRepo: Repository<CourseInfoEntity>,
  ) {}

  // update course info
  async updateCourseInfos(
    userId: string,
    courseId: string,
    infos: DraftCourseInfo[] | CourseInfo[],
    queryRunner: QueryRunner,
  ) {
    const dbCourseInfo = await queryRunner.manager.find(CourseInfoEntity, {
      where: { course: { id: courseId } },
      relations: ['course'],
    });

    let data = null;
    const updateCourseInfoIds = infos.map((info) => info.id);
    const deleteCourseInfo = dbCourseInfo.filter(
      (row) => !updateCourseInfoIds.includes(row.id),
    );

    if (deleteCourseInfo.length > 0) {
      await queryRunner.manager.remove(CourseInfoEntity, deleteCourseInfo);
    }

    if (infos && infos.length > 0) {
      data = infos.map((info) =>
        this.courseInfoRepo.create({
          ...new CourseInfoEntity(),
          ...info,
          updatedUser: userId,
          updatedTime: new Date(),
          ...(!info.id && { createdUser: userId }),
        }),
      );
    }
    return data;
  }
}
