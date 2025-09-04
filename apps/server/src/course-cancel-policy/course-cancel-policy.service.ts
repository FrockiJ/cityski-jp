import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CourseCancelPolicy as CourseCancelPolicyEntity } from './entities/course-cancel-policy.entity';
import {
  CourseBkgType,
  CourseCancelPolicyDTO,
  CourseCancelPolicyType,
  CourseType,
  DraftCourseCancelPolicyDTO,
} from '@repo/shared';
import { CustomException } from 'src/common/exception/custom.exception';

@Injectable()
export class CourseCancelPolicyService {
  constructor(
    @InjectRepository(CourseCancelPolicyEntity)
    private readonly courseCancelPolicyRepo: Repository<CourseCancelPolicyEntity>,
  ) {}

  async createCourseCancelPolicy(
    userId: string,
    cancelPolices: CourseCancelPolicyDTO[] | DraftCourseCancelPolicyDTO[],
    type: CourseType,
    bkgType: CourseBkgType,
  ) {
    try {
      const data = [];
      if (cancelPolices && cancelPolices.length > 0) {
        // 類型一：期限內取消需要付場地費
        // 室內團體課(預約)、室內私人課(預約)、室內個人練習(預約/指定)
        if (
          cancelPolices &&
          cancelPolices.length > 0 &&
          ((type === CourseType.GROUP && bkgType === CourseBkgType.FLEXIBLE) ||
            (type === CourseType.PRIVATE &&
              bkgType === CourseBkgType.FLEXIBLE) ||
            type === CourseType.INDIVIDUAL)
        ) {
          for (const cancelPolicy of cancelPolices) {
            if (
              cancelPolicy.type !==
              CourseCancelPolicyType.CANCEL_WITHIN_DEADLINE_PAY
            ) {
              throw new CustomException(
                'cancelPolicy type error: 室內團體課(預約)、室內私人課(預約)、室內個人練習(預約/指定)只能為type 1',
                HttpStatus.BAD_REQUEST,
              );
            }
            data.push(
              this.courseCancelPolicyRepo.create({
                ...new CourseCancelPolicyEntity(),
                ...cancelPolicy,
                createdUser: userId,
                updatedUser: userId,
              }),
            );
          }
        }
        // 類型二：期限前可以免費改期，期限後只能取消退款
        // 室內團體課(指定)、海外私人課(預約)、海外團體課(指定)
        // todo: 海外私人課(預約)、海外團體課(指定) 尚未加入條件
        if (
          cancelPolices &&
          cancelPolices.length > 0 &&
          type === CourseType.GROUP &&
          bkgType === CourseBkgType.FIXED
        ) {
          if (cancelPolices && cancelPolices.length !== 2) {
            throw new CustomException(
              'When bkgType is 2, it must always have exactly two records.',
              HttpStatus.BAD_REQUEST,
            );
          }
          for (const cancelPolicy of cancelPolices) {
            if (
              cancelPolicy.type !==
              CourseCancelPolicyType.BEFORE_FREE_OR_AFTER_DEADLINE_CANCEL
            ) {
              throw new CustomException(
                'cancelPolicy type error: 室內團體課(指定)、海外私人課(預約)、海外團體課(指定)只能為type 2',
                HttpStatus.BAD_REQUEST,
              );
            }
            data.push(
              this.courseCancelPolicyRepo.create({
                ...new CourseCancelPolicyEntity(),
                ...cancelPolicy,
                ...(!cancelPolicy.id && { createdUser: userId }),
                updatedUser: userId,
              }),
            );
          }
        }
      }

      return data.length > 0 ? data : null;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // update course info
  async updateCourseCancelPolicy(
    userId: string,
    courseId,
    type: CourseType,
    bkgType: CourseBkgType,
    cancelPolices: CourseCancelPolicyDTO[] | DraftCourseCancelPolicyDTO[],
    queryRunner: QueryRunner,
  ) {
    try {
      const dbCancelPolices = await queryRunner.manager.find(
        CourseCancelPolicyEntity,
        {
          where: { course: { id: courseId } },
          relations: ['course'],
        },
      );

      let data = null;
      const updateCourseInfoIds = cancelPolices.map((info) => info.id);
      const deleteCourseCancelPolicy = dbCancelPolices.filter(
        (row) => !updateCourseInfoIds.includes(row.id),
      );

      if (deleteCourseCancelPolicy.length > 0) {
        await queryRunner.manager.remove(
          CourseCancelPolicyEntity,
          deleteCourseCancelPolicy,
        );
      }

      data = this.createCourseCancelPolicy(
        userId,
        cancelPolices,
        type,
        bkgType,
      );

      return data;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
