import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThanOrEqual, QueryRunner, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import {
  CourseBkgType,
  CoursePaxLimitType,
  CourseReleaseType,
  CourseRemovalType,
  CourseStatusType,
  CourseType,
  CreateCourseRequestDTO,
  CreateDraftCourseRequestDTO,
  DraftCoursePeople,
  GetClientCoursesResponseDTO,
  GetCourseDetailResponseDTO,
  GetCourseManagementVenuesResponseDTO,
  GetCoursesRequestDTO,
  GetCoursesResponseDTO,
  GetPublishedCoursesResponseDTO,
  OrderByType,
  ResWithPaginationDTO,
  UpdateCourseManagementVenuesRequestDTO,
  UpdateCourseRequestDTO,
  UpdateDraftCourseRequestDTO,
  UpdatePublishedCoursesSortingRequestDTO,
} from '@repo/shared';
import { CustomException } from 'src/common/exception/custom.exception';
import { CoursePeople } from './entities/course-people.entity';
import { CourseInfo } from 'src/course-info/entities/course-info.entity';
import { Department } from 'src/departments/entities/department.entity';
import { plainToInstance } from 'class-transformer';
import { File } from 'src/files/entities/file.entity';
import { CoursePlanService } from 'src/course-plan/course-plan.service';
import { CourseInfoService } from 'src/course-info/course-info.service';
import { FilesService } from 'src/files/files.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CourseCancelPolicyService } from 'src/course-cancel-policy/course-cancel-policy.service';
import { CourseVenue as CourseVenueEntity } from './entities/course-venue.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(CoursePeople)
    private readonly coursePeopleRepo: Repository<CoursePeople>,
    @InjectRepository(CourseInfo)
    private readonly courseInfoRepo: Repository<CourseInfo>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    @InjectRepository(CourseVenueEntity)
    private readonly courseVenueRepo: Repository<CourseVenueEntity>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
    private readonly coursePlanService: CoursePlanService,
    private readonly courseInfoService: CourseInfoService,
    private readonly courseCancelPolicyService: CourseCancelPolicyService,
    private readonly filesService: FilesService,
    private readonly dataSource: DataSource,
  ) {}

  async generateNo(type: string, queryRunner?: QueryRunner): Promise<string> {
    try {
      // 查詢當前 type 的最大編號
      let lastItem = null;
      if (queryRunner) {
        lastItem = await queryRunner.manager.findOne(Course, {
          where: { type },
          order: { no: 'DESC' }, // 取第一筆
        });
      } else {
        lastItem = await this.courseRepo.findOne({
          where: { type },
          order: { no: 'DESC' }, // 取第一筆
        });
      }

      let nextNo = 1;

      if (lastItem) {
        // 提取數字
        const lastNo = parseInt(lastItem.no.slice(1), 10);
        nextNo = lastNo + 1;
      }

      // 格式化加上type
      return `${type}${nextNo.toString().padStart(4, '0')}`;
    } catch (err) {
      throw new HttpException(
        `Error when attempting to generate a number with generateNo: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCourses(
    request: GetCoursesRequestDTO,
  ): Promise<ResWithPaginationDTO<GetCoursesResponseDTO[]>> {
    const {
      departmentId,
      page,
      limit,
      sort = 'createdTime',
      order = 'asc',
      keyword,
      status,
      type,
      bkgType,
      startReleaseDate,
      endReleaseDate,
      startRemovalDate,
      endRemovalDate,
      startUpdatedTime,
      endUpdatedTime,
    } = request;
    try {
      const queryBuilder = this.courseRepo.createQueryBuilder('course');

      // check page and limit, default to 1 and 10 if not present.
      const customPage = isNaN(Number(page)) || page <= 0 ? 1 : Number(page);
      const customLimit =
        isNaN(Number(limit)) || limit <= 0 ? 10 : Number(limit);

      // --- filters ---
      // -- filter: by department --
      queryBuilder.andWhere('course.department_id = :departmentId', {
        departmentId,
      });

      // -- filter: by releaseDate --
      if (startReleaseDate && endReleaseDate) {
        queryBuilder.andWhere(
          'DATE(course.releaseDate) >= :startReleaseDate AND DATE(course.releaseDate) <= :endReleaseDate',
          {
            startReleaseDate: new Date(startReleaseDate),
            endReleaseDate: new Date(endReleaseDate),
          },
        );
      }

      // -- filter: by removalDate --
      if (startRemovalDate && endRemovalDate) {
        queryBuilder.andWhere(
          'DATE(course.removalDate) >= :startRemovalDate AND DATE(course.removalDate) <= :endRemovalDate',
          {
            startRemovalDate: new Date(startRemovalDate),
            endRemovalDate: new Date(endRemovalDate),
          },
        );
      }

      // -- filter: by date --
      if (startUpdatedTime && endUpdatedTime) {
        queryBuilder.andWhere(
          'DATE(course.updatedTime) >= :startUpdatedTime AND DATE(course.updatedTime) <= :endUpdatedTime',
          {
            startUpdatedTime: new Date(startUpdatedTime),
            endUpdatedTime: new Date(endUpdatedTime),
          },
        );
      }

      // -- filter: by status --
      const statusArray = String(status)
        .split(',')
        .map((status) => Number(status))
        .filter((status) => !isNaN(status)); // Filter out invalid numbers

      if (statusArray.length > 0) {
        queryBuilder.andWhere('course.status IN (:...statusArray)', {
          statusArray,
        });
      }

      // -- filter: by type --
      if (type) {
        const typeArray = String(type).split(',');
        if (typeArray.length > 0) {
          queryBuilder.andWhere('course.type IN (:...typeArray)', {
            typeArray,
          });
        }
      }

      // -- filter: by bkgType --
      const bkgTypeArray = String(bkgType)
        .split(',')
        .map((bkgType) => Number(bkgType))
        .filter((bkgType) => !isNaN(bkgType)); // Filter out invalid numbers

      if (bkgTypeArray.length > 0) {
        queryBuilder.andWhere('course.bkgType IN (:...bkgTypeArray)', {
          bkgTypeArray,
        });
      }

      // -- filter: by keyword search --
      if (keyword) {
        queryBuilder.andWhere('course.name ILIKE :keyword', {
          keyword: `%${keyword}%`,
        });
      }

      // --- sorting ---
      const columnMap = {
        bkgType: 'bkg_type',
        releaseDate: 'release_date',
        removalDate: 'removal_date',
        updatedTime: 'updated_time',
      };

      const dbSortCol = columnMap[sort] || sort;

      queryBuilder.orderBy(`course.${dbSortCol}`, OrderByType[order]);

      // --- pagination ---
      queryBuilder.skip((customPage - 1) * customLimit).take(customLimit);

      // run query
      const [courses, total] = await queryBuilder.getManyAndCount();

      const coursesDTOs = plainToInstance(GetCoursesResponseDTO, courses, {
        excludeExtraneousValues: true,
      });

      const res = {
        data: coursesDTOs,
        total,
        page: customPage,
        limit: customLimit,
        pages: Math.ceil(total / limit),
      };

      return res;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   *
   * @param userId 帳號id
   * @param body request
   * @param createApiType api類型 草稿DRAFT或是正式PUBLISHED(在這裏status是scheduling或published都以PUBLISHED代表)
   */
  async createCourse(
    userId: string,
    body: CreateCourseRequestDTO | CreateDraftCourseRequestDTO,
    createApiType: CourseStatusType,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        status,
        name,
        type,
        releaseType,
        releaseDate,
        removalType,
        removalDate,
        departmentId,
        coursePeople,
        courseInfos,
        courseCancelPolicies,
        coursePlans,
        attachments,
        ...others
      } = body;
      const department = await queryRunner.manager.findOne(Department, {
        where: { id: departmentId },
      });
      if (!department) {
        throw new CustomException('分店不存在', HttpStatus.BAD_REQUEST);
      }
      if (
        createApiType === CourseStatusType.PUBLISHED &&
        status === CourseStatusType.DRAFT
      ) {
        throw new CustomException('status不可為草稿', HttpStatus.BAD_REQUEST);
      }

      if (
        createApiType === CourseStatusType.DRAFT &&
        status !== CourseStatusType.DRAFT
      ) {
        throw new CustomException('status必須為草稿', HttpStatus.BAD_REQUEST);
      }

      if (
        createApiType === CourseStatusType.PUBLISHED &&
        body.bkgType === CourseBkgType.FIXED &&
        body.paxLimitType !== CoursePaxLimitType.SAME
      ) {
        throw new CustomException(
          'bkgType為2時，paxLimitType只能為S',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        createApiType === CourseStatusType.PUBLISHED &&
        releaseType === CourseReleaseType.IMMEDIATE &&
        status !== CourseStatusType.PUBLISHED
      ) {
        throw new CustomException(
          "When the releaseType is 'I', the status must be 2.",
          HttpStatus.BAD_REQUEST,
        );
      }

      // 上下架日期檢查
      let customReleaseDate = null;
      let customRemovalDate = null;

      if (releaseType === CourseReleaseType.IMMEDIATE) {
        customReleaseDate = new Date().getTime();
      } else {
        customReleaseDate = releaseDate
          ? new Date(releaseDate).setHours(0, 0, 0, 0)
          : null;
      }

      if (removalType === CourseRemovalType.ULIMIT) {
        customRemovalDate = null;
      } else {
        customRemovalDate = removalDate
          ? new Date(removalDate).setHours(0, 0, 0, 0)
          : null;
      }

      if (
        createApiType === CourseStatusType.PUBLISHED &&
        releaseDate &&
        releaseType !== CourseReleaseType.IMMEDIATE &&
        removalDate &&
        removalType !== CourseRemovalType.ULIMIT
      ) {
        const now = new Date().setHours(0, 0, 0, 0);
        customReleaseDate = new Date(releaseDate).setHours(0, 0, 0, 0);
        customRemovalDate = new Date(removalDate).setHours(0, 0, 0, 0);

        if (
          releaseType !== CourseReleaseType.IMMEDIATE &&
          new Date(customReleaseDate) >= new Date(customRemovalDate)
        ) {
          throw new CustomException(
            '下架時間須晚於上架時間',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (customReleaseDate <= now || customRemovalDate <= now) {
          throw new CustomException(
            '上下架時間須為今日之後',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        createApiType === CourseStatusType.PUBLISHED &&
        attachments &&
        attachments.length !== 6
      ) {
        throw new CustomException(
          '一個課程須上傳6張圖片',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (attachments && attachments.length > 6) {
        throw new CustomException(
          '一個課程最多上傳6張圖片',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        others.bkgType === CourseBkgType.FIXED &&
        type === CourseType.PRIVATE
      ) {
        throw new CustomException(
          "type為'p'(私人課)時bkgType只能選擇1(預約)",
          HttpStatus.BAD_REQUEST,
        );
      }

      let savedPeople = null;
      if (coursePeople && coursePeople.length > 0) {
        savedPeople = coursePeople.map((people) =>
          this.coursePeopleRepo.create({
            ...new CoursePeople(),
            ...people,
            createdUser: userId,
            updatedUser: userId,
          }),
        );
        // 正式才檢查人數
        if (createApiType === CourseStatusType.PUBLISHED) {
          for (const people of savedPeople) {
            if (
              type === CourseType.PRIVATE &&
              (!people.basePeople || !people.addPrice)
            ) {
              throw new CustomException(
                "type為'P'(私人課)時，basePeople和addPrice為必填",
                HttpStatus.BAD_REQUEST,
              );
            }
            if (people.minPeople > people.maxPeople) {
              throw new CustomException(
                'maxPeople不可小於minPeople',
                HttpStatus.BAD_REQUEST,
              );
            }
            if (
              type === CourseType.PRIVATE &&
              people.basePeople > people.maxPeople
            ) {
              throw new CustomException(
                'basePeople不可大於maxPeople',
                HttpStatus.BAD_REQUEST,
              );
            }
            if (
              type === CourseType.PRIVATE &&
              people.basePeople < people.minPeople
            ) {
              throw new CustomException(
                'basePeople不可小於minPeople',
                HttpStatus.BAD_REQUEST,
              );
            }
          }
        }
      }

      let savedInfos = null;
      if (courseInfos && courseInfos.length > 0) {
        savedInfos = courseInfos.map((info) =>
          this.courseInfoRepo.create({
            ...new CourseInfo(),
            ...info,
            createdUser: userId,
            updatedUser: userId,
          }),
        );
      }

      // create or update courseCancelPolicy
      const savedCancelPolices =
        await this.courseCancelPolicyService.createCourseCancelPolicy(
          userId,
          courseCancelPolicies,
          type,
          body.bkgType,
        );

      const savedCourse = this.courseRepo.create({
        ...new Course(),
        ...others,
        status,
        name,
        type,
        releaseType,
        releaseDate: customReleaseDate ? new Date(customReleaseDate) : null,
        removalType,
        removalDate: customRemovalDate ? new Date(customRemovalDate) : null,
        actualRemovalDate: null,
        no: await this.generateNo(type, queryRunner),
        createdUser: userId,
        updatedUser: userId,
        department: { id: departmentId },
        sequence: 1,
        // cascade 關聯會一起新增
        ...(savedPeople && { coursePeople: savedPeople }),
        ...(savedInfos && { courseInfos: savedInfos }),
        ...(savedCancelPolices && { courseCancelPolicies: savedCancelPolices }),
      });

      let courseId = null;
      // The latest published data needs to be placed first.
      if (
        status === CourseStatusType.PUBLISHED &&
        createApiType === CourseStatusType.PUBLISHED
      ) {
        const publishedCourses = await queryRunner.manager.find(Course, {
          where: {
            department: { id: departmentId },
            status: CourseStatusType.PUBLISHED,
          },
          order: {
            sequence: 'ASC',
          },
          relations: ['department'],
        });
        // add new course to sequence: 1
        const savedCourses = [
          savedCourse,
          ...publishedCourses.map((course) =>
            this.courseRepo.create({
              ...new Course(),
              ...course,
              sequence: course.sequence + 1,
            }),
          ),
        ];

        const newCourses = await queryRunner.manager.save(savedCourses);
        courseId = newCourses[0].id;
      } else {
        const newCourse = await queryRunner.manager.save(savedCourse);
        courseId = newCourse.id;
      }

      // create course plan
      if (coursePlans && coursePlans.length > 0) {
        const suggestionCount = coursePlans.filter(
          (plan) => plan.suggestion === true,
        );
        if (suggestionCount?.length > 1) {
          throw new CustomException(
            '同個課程suggestion為true的方案只能有一個',
            HttpStatus.BAD_REQUEST,
          );
        }

        for (const plan of coursePlans) {
          await this.coursePlanService.createCoursePlan(
            userId,
            courseId,
            plan,
            savedCourse,
            queryRunner,
          );
        }
      }

      // create files
      if (attachments && attachments.length > 0) {
        const files = attachments.map((file) => {
          const newFile = new File();
          return this.fileRepo.create({
            ...newFile,
            tableId: courseId,
            tableName: 'course',
            mediaType: file.mediaType,
            deviceType: file.deviceType,
            fileUrl: file.key,
            originalName: file.originalName,
            description: file.originalName.split('.')[0],
            sequence: file.sequence,
          });
        });

        await queryRunner.manager.save(files);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log('course error rollback');
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  // update course people
  async updateCoursePeople(
    userId: string,
    courseId: string,
    people: DraftCoursePeople[] | CoursePeople[],
    queryRunner: QueryRunner,
  ) {
    const dbCoursePeople = await queryRunner.manager.find(CoursePeople, {
      where: { course: { id: courseId } },
      relations: ['course'],
    });

    let updateData = null;
    const updateCoursePeopleIds = people.map((people) => people.id);
    const deleteCoursePeople = dbCoursePeople.filter(
      (row) => !updateCoursePeopleIds.includes(row.id),
    );
    if (deleteCoursePeople.length > 0) {
      await queryRunner.manager.remove(CoursePeople, deleteCoursePeople);
    }
    if (people && people.length > 0) {
      updateData = people.map((people) => {
        const targetPeople = dbCoursePeople.find(
          (dbPeople) => dbPeople.id === people.id,
        );

        return this.coursePeopleRepo.create({
          ...targetPeople,
          ...new CoursePeople(),
          ...people,
          updatedUser: userId,
          updatedTime: new Date(),
          ...(!people.id && { createdUser: userId }),
        });
      });
    }
    return updateData;
  }

  /**
   *
   * @param userId 帳號id
   * @param body request
   * @param updateApiType api類型 草稿DRAFT或是正式PUBLISHED(在這裏status是scheduling或published都以PUBLISHED代表)
   */
  async updateCourse(
    userId: string,
    body: UpdateDraftCourseRequestDTO | UpdateCourseRequestDTO,
    updateApiType: CourseStatusType,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        departmentId,
        id,
        status,
        type,
        releaseType,
        releaseDate,
        removalType,
        removalDate,
        coursePeople,
        courseInfos,
        courseCancelPolicies,
        coursePlans,
        attachments,
        ...others
      } = body;

      const course = await queryRunner.manager.findOne(Course, {
        where: { id },
      });

      if (!course) {
        throw new CustomException('id不存在', HttpStatus.BAD_REQUEST);
      }

      if (
        updateApiType === CourseStatusType.DRAFT &&
        status !== CourseStatusType.DRAFT
      ) {
        throw new CustomException('status必須為草稿', HttpStatus.BAD_REQUEST);
      }

      if (
        updateApiType === CourseStatusType.PUBLISHED &&
        status === CourseStatusType.DRAFT
      ) {
        throw new CustomException('status不可為草稿', HttpStatus.BAD_REQUEST);
      }

      if (course.status === CourseStatusType.UNPUBLISHED) {
        throw new CustomException('不可修改已下架課程', HttpStatus.BAD_REQUEST);
      }

      if (
        course.status === CourseStatusType.PUBLISHED &&
        status !== CourseStatusType.PUBLISHED
      ) {
        throw new CustomException(
          '已上架課程無法退回草稿或排程中',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        updateApiType === CourseStatusType.PUBLISHED &&
        body.bkgType === CourseBkgType.FIXED &&
        body.paxLimitType !== CoursePaxLimitType.SAME
      ) {
        throw new CustomException(
          'bkgType為2時，paxLimitType只能為S',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        updateApiType === CourseStatusType.PUBLISHED &&
        releaseType === CourseReleaseType.IMMEDIATE &&
        status !== CourseStatusType.PUBLISHED
      ) {
        throw new CustomException(
          "When the releaseType is 'I', the status must be 2.",
          HttpStatus.BAD_REQUEST,
        );
      }

      if (type !== course.type) {
        throw new CustomException(
          '課程編號已建立，無法更改課程類型',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        updateApiType === CourseStatusType.PUBLISHED &&
        attachments &&
        attachments.length !== 6
      ) {
        throw new CustomException(
          '一個課程須上傳6張圖片',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (attachments && attachments.length > 6) {
        throw new CustomException(
          '一個課程最多上傳6張圖片',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        others.bkgType === CourseBkgType.FIXED &&
        type === CourseType.PRIVATE
      ) {
        throw new CustomException(
          "type為'p'(私人課)時bkgType只能選擇1(預約)",
          HttpStatus.BAD_REQUEST,
        );
      }

      // 上下架日期檢查
      let customReleaseDate = null;
      let customRemovalDate = null;

      if (releaseType === CourseReleaseType.IMMEDIATE) {
        customReleaseDate = new Date().getTime();
      } else {
        customReleaseDate = releaseDate
          ? new Date(releaseDate).setHours(0, 0, 0, 0)
          : null;
      }

      if (removalType === CourseRemovalType.ULIMIT) {
        customRemovalDate = null;
      } else {
        customRemovalDate = removalDate
          ? new Date(removalDate).setHours(0, 0, 0, 0)
          : null;
      }

      if (
        updateApiType === CourseStatusType.PUBLISHED &&
        releaseDate &&
        releaseType !== CourseReleaseType.IMMEDIATE &&
        removalDate &&
        removalType !== CourseRemovalType.ULIMIT
      ) {
        const now = new Date().setHours(0, 0, 0, 0);
        customReleaseDate = new Date(releaseDate).setHours(0, 0, 0, 0);
        customRemovalDate = new Date(removalDate).setHours(0, 0, 0, 0);

        if (
          releaseType !== CourseReleaseType.IMMEDIATE &&
          new Date(customReleaseDate) >= new Date(customRemovalDate)
        ) {
          throw new CustomException(
            '下架時間須晚於上架時間',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (customReleaseDate <= now || customRemovalDate <= now) {
          throw new CustomException(
            '上下架時間須為今日之後',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // update coursePeople
      let savedPeople = null;
      if (coursePeople && course.status !== CourseStatusType.PUBLISHED) {
        savedPeople = await this.updateCoursePeople(
          userId,
          id,
          coursePeople,
          queryRunner,
        );
      }

      if (savedPeople && updateApiType === CourseStatusType.PUBLISHED) {
        for (const people of savedPeople) {
          if (
            type === CourseType.PRIVATE &&
            (!people.basePeople || !people.addPrice)
          ) {
            throw new CustomException(
              "type為'P'(私人課)時，basePeople和addPrice為必填",
              HttpStatus.BAD_REQUEST,
            );
          }

          if (people.minPeople > people.maxPeople) {
            throw new CustomException(
              'maxPeople不可小於minPeople',
              HttpStatus.BAD_REQUEST,
            );
          }
          if (
            type === CourseType.PRIVATE &&
            people.basePeople > people.maxPeople
          ) {
            throw new CustomException(
              'basePeople不可大於maxPeople',
              HttpStatus.BAD_REQUEST,
            );
          }
          if (
            type === CourseType.PRIVATE &&
            people.basePeople < people.minPeople
          ) {
            throw new CustomException(
              'basePeople不可小於minPeople',
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

      // create or update courseInfos
      let savedInfos = null;
      if (courseInfos && course.status !== CourseStatusType.PUBLISHED) {
        savedInfos = await this.courseInfoService.updateCourseInfos(
          userId,
          id,
          courseInfos,
          queryRunner,
        );
      }

      // create or update courseCancelPolicy
      let savedCancelPolices = null;
      if (
        courseCancelPolicies &&
        course.status !== CourseStatusType.PUBLISHED
      ) {
        savedCancelPolices =
          await this.courseCancelPolicyService.updateCourseCancelPolicy(
            userId,
            id,
            type,
            body.bkgType,
            courseCancelPolicies,
            queryRunner,
          );
      }

      let savedCourse = null;
      // 草稿跟發布後的可編輯欄位不同
      if (
        course.status === CourseStatusType.DRAFT ||
        course.status === CourseStatusType.SCHEDULED
      ) {
        savedCourse = this.courseRepo.create({
          ...course,
          ...others,
          status,
          releaseType,
          releaseDate: customReleaseDate ? new Date(customReleaseDate) : null,
          removalType,
          removalDate: customRemovalDate ? new Date(customRemovalDate) : null,
          actualRemovalDate: null,
          updatedUser: userId,
          updatedTime: new Date(),
          // cascade 關聯會一起新增
          ...(savedPeople && { coursePeople: savedPeople }),
          ...(savedInfos && { courseInfos: savedInfos }),
          ...(savedCancelPolices && {
            courseCancelPolicies: savedCancelPolices,
          }),
        });
      } else if (course.status === CourseStatusType.PUBLISHED) {
        savedCourse = this.courseRepo.create({
          ...course,
          removalType,
          removalDate: customRemovalDate ? new Date(customRemovalDate) : null,
          updatedUser: userId,
          updatedTime: new Date(),
        });
      }

      if (!savedCourse) {
        throw new CustomException('儲存失敗', HttpStatus.BAD_REQUEST);
      }

      // The latest published data needs to be placed first.
      if (
        status === CourseStatusType.PUBLISHED &&
        updateApiType === CourseStatusType.PUBLISHED
      ) {
        const publishedCourses = await queryRunner.manager.find(Course, {
          where: {
            department: { id: departmentId },
            status: CourseStatusType.PUBLISHED,
          },
          order: {
            sequence: 'ASC',
          },
          relations: ['department'],
        });
        // add new course to sequence: 1
        const savedCourses = [
          savedCourse,
          ...publishedCourses?.map((course, index) =>
            this.courseRepo.create({
              ...new Course(),
              ...course,
              sequence: index + 2,
            }),
          ),
        ];

        await queryRunner.manager.save(savedCourses);
      } else {
        await queryRunner.manager.save(savedCourse);
      }

      // update course plan
      if (coursePlans) {
        await this.coursePlanService.update(
          userId,
          coursePlans,
          savedCourse,
          queryRunner,
        );
      }

      // update files
      if (attachments && course.status !== CourseStatusType.PUBLISHED) {
        await this.filesService.updateFilesWithTransaction(
          attachments,
          id,
          'course',
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
  // scheduling to draft
  async revertCourse(userId: string, courseId: string) {
    try {
      const course = await this.courseRepo.findOne({
        where: { id: courseId },
      });
      if (!course) {
        throw new CustomException('課程不存在', HttpStatus.BAD_REQUEST);
      }
      if (course.status !== CourseStatusType.SCHEDULED) {
        throw new CustomException(
          '只有排程中能退回草稿',
          HttpStatus.BAD_REQUEST,
        );
      }
      const savedCourse = this.courseRepo.create({
        ...course,
        status: CourseStatusType.DRAFT,
        updatedTime: new Date(),
        updatedUser: userId,
      });
      await this.courseRepo.save(savedCourse);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }
  // delete draft
  async deleteCourse(id: string) {
    try {
      const course = await this.courseRepo.findOne({
        where: { id },
      });

      if (!course) {
        throw new CustomException('課程不存在', HttpStatus.BAD_REQUEST);
      }
      if (course.status !== CourseStatusType.DRAFT) {
        throw new CustomException('只有草稿能刪除', HttpStatus.BAD_REQUEST);
      }
      // cascade 關聯會一起刪除
      await this.courseRepo.remove(course);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // unpublished course
  async unpublishedCourse(userId: string, id: string) {
    try {
      const course = await this.courseRepo.findOne({
        where: { id },
      });
      if (!course) {
        throw new CustomException('課程不存在', HttpStatus.BAD_REQUEST);
      }
      if (course.status !== CourseStatusType.PUBLISHED) {
        throw new CustomException('只能下架已上架課程', HttpStatus.BAD_REQUEST);
      }
      const savedCourse = this.courseRepo.create({
        ...course,
        status: CourseStatusType.UNPUBLISHED,
        updatedTime: new Date(),
        updatedUser: userId,
      });
      await this.courseRepo.save(savedCourse);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async getCourseDetail(id: string): Promise<GetCourseDetailResponseDTO> {
    try {
      const isCourseExist = await this.courseRepo.exists({ where: { id } });
      if (!isCourseExist) {
        throw new CustomException('課程不存在', HttpStatus.BAD_REQUEST);
      }

      const queryBuilderWithFiles = this.courseRepo
        .createQueryBuilder('course')
        .leftJoinAndSelect(
          File,
          'file',
          'file.tableId = course.id AND file.tableName = :tableName',
          { tableName: 'course' },
        )
        .where('course.id = :id', {
          id,
        });

      const queryBuilderWithPeople = this.courseRepo
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.coursePeople', 'coursePeople')
        .where('coursePeople.course_id = :id', {
          id,
        });

      const queryBuilderWithInfos = this.courseRepo
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.courseInfos', 'courseInfo')
        .where('courseInfo.course_id = :id', {
          id,
        });

      const queryBuilderWithCancelPolicies = this.courseRepo
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.courseCancelPolicies', 'courseCancelPolicy')
        .where('courseCancelPolicy.course_id = :id', {
          id,
        });

      const queryBuilderWithPlans = this.courseRepo
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.coursePlans', 'coursePlan')
        .leftJoinAndSelect('coursePlan.sessions', 'sessions')
        .where('coursePlan.course_id = :id', {
          id,
        });

      const coursePeople = await queryBuilderWithPeople.getRawMany();
      const courseInfos = await queryBuilderWithInfos.getRawMany();
      const courseCancelPolicies =
        await queryBuilderWithCancelPolicies.getRawMany();
      const coursePlans = await queryBuilderWithPlans.getRawMany();
      const courseFiles = await queryBuilderWithFiles.getRawMany();

      const course = {
        id: courseFiles[0].course_id,
        departmentId: courseFiles[0].course_department_id,
        no: courseFiles[0].course_no,
        type: courseFiles[0].course_type,
        teachingType: courseFiles[0].course_teaching_type,
        status: courseFiles[0].course_status,
        name: courseFiles[0].course_name,
        skiType: courseFiles[0].course_ski_type,
        description: courseFiles[0].course_description,
        explanation: courseFiles[0].course_explanation,
        promotion: courseFiles[0].course_promotion,
        bkgType: courseFiles[0].course_bkg_type,
        length: courseFiles[0].course_length,
        bkgStartDay: courseFiles[0].course_bkg_start_day,
        bkgLatestDayUnit: courseFiles[0].course_bkg_latest_day_unit,
        bkgLatestDay: courseFiles[0].course_bkg_latest_day,
        paxLimitType: courseFiles[0].course_pax_limit_type,
        releaseType: courseFiles[0].course_release_type,
        releaseDate: courseFiles[0].course_release_date,
        removalType: courseFiles[0].course_removal_type,
        removalDate: courseFiles[0].course_removal_date,
        actualRemovalDate: courseFiles[0].course_actual_removal_date,
        checkBefDay: courseFiles[0].course_check_bef_day,
        cancelable: courseFiles[0].course_cancelable,
        sequence: courseFiles[0].course_sequence,
        coursePeople: courseFiles[0].course_coursePeople,
        courseInfos: courseFiles[0].course_courseInfos,
        courseCancelPolicies: courseFiles[0].courseCancelPolicies,
        coursePlans: courseFiles[0].course_plans,
        attachments: [],
      };

      const people = coursePeople.map((people) => ({
        id: people.coursePeople_id,
        type: people.coursePeople_type,
        minPeople: people.coursePeople_min_people,
        maxPeople: people.coursePeople_max_people,
        basePeople: people.coursePeople_base_people,
        addPrice: people.coursePeople_add_price,
      }));

      const infos = courseInfos.map((info) => ({
        id: info.courseInfo_id,
        type: info.courseInfo_type,
        explanation: info.courseInfo_explanation,
        sequence: info.courseInfo_sequence,
      }));

      const cancelPolicies = courseCancelPolicies.map((policy) => ({
        id: policy.courseCancelPolicy_id,
        type: policy.courseCancelPolicy_type,
        beforeDay: policy.courseCancelPolicy_before_day,
        withinDay: policy.courseCancelPolicy_within_day,
        price: policy.courseCancelPolicy_price,
        sequence: policy.courseCancelPolicy_sequence,
      }));

      // format plan with sessions
      const tempIds = [];
      const plans = coursePlans.reduce((prev, cur) => {
        const arr = [...prev];
        if (!tempIds.includes(cur.coursePlan_id)) {
          tempIds.push(cur.coursePlan_id);
          arr.push({
            id: cur.coursePlan_id,
            name: cur.coursePlan_name, // plan name
            type: cur.coursePlan_type, // plan type (e.g., 0, 1, 2, 3, 4)
            price: cur.coursePlan_price, // price per session
            number: cur.coursePlan_number, // number of sessions
            autoCancel: cur.coursePlan_auto_cancel, // whether the plan auto-cancels
            befDay: cur.coursePlan_bef_day, // days before booking allowed
            befNoPaid: cur.coursePlan_bef_no_paid, // days before deposit due
            aftDay: cur.coursePlan_aft_day, // days after booking allowed
            aftNoPaid: cur.coursePlan_aft_no_paid, // days after deposit due
            promotion: cur.coursePlan_promotion, // promotion description
            sequence: cur.coursePlan_sequence, // display order
            suggestion: cur.coursePlan_suggestion, // whether the plan is recommended
            level: cur.coursePlan_level,
            ...(cur.sessions_id && {
              sessions: [
                {
                  id: cur.sessions_id,
                  no: cur.sessions_no,
                  startTime: cur.sessions_start_time,
                  endTime: cur.sessions_end_time,
                },
              ],
            }),
          });
        } else {
          const target = arr.find((item) => item.id === cur.coursePlan_id);
          if (target) {
            target.sessions = cur.sessions_id && [
              ...target.sessions,
              {
                id: cur.sessions_id,
                no: cur.sessions_no,
                startTime: cur.sessions_start_time,
                endTime: cur.sessions_end_time,
              },
            ];
          }
        }

        return arr;
      }, []);

      const files = courseFiles.map((course) => ({
        id: course.file_id,
        key: course.file_file_url,
        originalName: course.file_original_name,
        mediaType: course.file_media_type,
        deviceType: course.file_device_type,
        sequence: course.file_sequence,
      }));

      course.coursePeople = people;
      course.courseInfos = infos;
      course.courseCancelPolicies = cancelPolicies;
      course.coursePlans = plans;
      course.attachments = files;

      return course;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async getPublishedCourses(
    departmentId: string,
  ): Promise<GetPublishedCoursesResponseDTO[]> {
    try {
      const courses = await this.courseRepo.find({
        where: {
          department: { id: departmentId },
          status: CourseStatusType.PUBLISHED,
        },
        order: {
          sequence: 'ASC',
        },
        relations: ['department'],
      });
      const res = plainToInstance(GetPublishedCoursesResponseDTO, courses, {
        excludeExtraneousValues: true,
      });
      return res;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async updatePublishedCoursesSorting(
    body: UpdatePublishedCoursesSortingRequestDTO,
  ) {
    // const { departmentId, courses } = body;
    const { courses } = body;
    try {
      // department id possibly unneeded
      // const DBCourses = await this.courseRepo.find({
      //   where: { department: { id: departmentId } },
      //   order: {
      //     sequence: 'ASC',
      //   },
      //   relations: ['department'],
      // });
      // console.log('DBCourses', DBCourses);

      await this.courseRepo.save(courses);
      // return;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   *
   * @param id department id
   * @returns
   */
  async getCourseManagementVenues(
    id: string,
  ): Promise<GetCourseManagementVenuesResponseDTO> {
    try {
      const venues = await this.courseVenueRepo.find({
        where: { department: { id } },
        relations: ['department', 'departmentVenue'],
      });

      let res = null;
      if (venues.length > 0) {
        res = venues.map((venue) => ({
          id: venue.id,
          departmentId: venue.department?.id,
          group: venue.group,
          private: venue.private,
          individual: venue.individual,
          name: venue.departmentVenue?.name,
        }));
      }

      return res;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async updateCourseManagementVenues(
    body: UpdateCourseManagementVenuesRequestDTO[],
    userId: string,
  ) {
    try {
      let savedCourseVenues = [];
      for (const venue of body) {
        if (!venue.id) {
          throw new CustomException(
            'Please ensure that all updated data includes an id field.',
            HttpStatus.BAD_REQUEST,
          );
        }
        const CourseVenue = await this.courseVenueRepo.findOne({
          where: { id: venue.id },
        });
        console.log('CourseVenue', CourseVenue);
        savedCourseVenues = [
          ...savedCourseVenues,
          this.courseVenueRepo.create({
            ...new CourseVenueEntity(),
            ...CourseVenue,
            ...venue,
            updatedUser: userId,
          }),
        ];
      }
      await this.courseVenueRepo.save(savedCourseVenues);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   * 根據releaseDate欄位的時間決定是否上架
   * 每天00:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async schedulePublished() {
    // step 1 取得所有可以上架的狀態為排程中的課程 不分分店
    const expiredCourses = await this.courseRepo.find({
      where: {
        releaseDate: LessThanOrEqual(new Date()),
        status: CourseStatusType.SCHEDULED,
      },
      relations: ['department'],
    });

    if (expiredCourses.length === 0) return;
    // 轉換結構 & 狀態更新
    const formatCoursesWithDepartment = expiredCourses.reduce(
      (prev, cur: Course) => {
        const data = { ...prev };

        const publishedCourse = this.courseRepo.create({
          ...cur,
          status: CourseStatusType.PUBLISHED,
        });

        if (data[cur.department.id]) {
          data[cur.department.id] = [
            ...data[cur.department.id],
            publishedCourse,
          ];
        } else {
          data[cur.department.id] = [publishedCourse];
        }

        return data;
      },
      {},
    );

    // step 2 因為要排序 所以需要針對各分店取得已上架課程的資料 然後重新排序後更新
    for (const [departmentId, courses] of Object.entries(
      formatCoursesWithDepartment as Record<string, Course[]>,
    )) {
      const publishedCourses = await this.courseRepo.find({
        where: {
          department: { id: departmentId },
          status: CourseStatusType.PUBLISHED,
        },
        order: {
          sequence: 'ASC',
        },
        relations: ['department'],
      });

      let savedPublishedCourses = [...courses, ...publishedCourses];

      savedPublishedCourses = savedPublishedCourses.map(
        (savedPublishedCourse, index) =>
          this.courseRepo.create({
            ...savedPublishedCourse,
            sequence: index + 1,
          }),
      );

      await this.courseRepo.save(savedPublishedCourses);
    }
  }

  /**
   * 根據removalDate欄位的時間決定是否下架
   * 每天00:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleUnpublished() {
    // step 1 取得所有可以下架的狀態為已上架的課程 不分分店
    const removalCourses = await this.courseRepo.find({
      where: {
        removalDate: LessThanOrEqual(new Date()),
        status: CourseStatusType.PUBLISHED,
      },
      relations: ['department'],
    });

    const savedUnpublishedCourses = removalCourses.map((removalCourse) => ({
      ...removalCourse,
      status: CourseStatusType.UNPUBLISHED,
      actualRemovalDate: removalCourse.removalDate,
      sequence: null,
    }));
    await this.courseRepo.save(savedUnpublishedCourses);

    // 取得所有有下架課程的分店id
    const departmentIds: string[] = removalCourses.reduce(
      (prev, cur: Course) => {
        let data = [...prev];

        if (!data.includes(cur.department.id)) {
          data = [...data, cur.department.id];
        }
        return data;
      },
      [],
    );

    // step 2 因為要排除下架的課程 所以需要針對各分店取得已上架課程的資料重新排序
    for (const departmentId of departmentIds as string[]) {
      const publishedCourses = await this.courseRepo.find({
        where: {
          department: { id: departmentId },
          status: CourseStatusType.PUBLISHED,
        },
        order: {
          sequence: 'ASC',
        },
        relations: ['department'],
      });

      const savedPublishedCourses = publishedCourses.map(
        (savedPublishedCourse, index) =>
          this.courseRepo.create({
            ...savedPublishedCourse,
            sequence: index + 1,
          }),
      );
      console.log('savedPublishedCourses', savedPublishedCourses);
      await this.courseRepo.save(savedPublishedCourses);
    }
  }

  /********************************************
   *              -- CLIENT --                *
   ********************************************/

  async getCoursesForClient(
    departmentId: string,
  ): Promise<GetClientCoursesResponseDTO[]> {
    try {
      const queryBuilderWithFiles = this.courseRepo
        .createQueryBuilder('course')
        .leftJoinAndSelect(
          File,
          'file',
          'file.tableId = course.id AND file.tableName = :tableName',
          { tableName: 'course' },
        )
        .where('course.department_id = :departmentId', {
          departmentId,
        })
        .andWhere('course.status = :status', {
          status: CourseStatusType.PUBLISHED,
        })
        .orderBy('course.sequence', 'ASC');

      const courseFiles = await queryBuilderWithFiles.getRawMany();

      const coursesWithPlans = await this.courseRepo.find({
        where: {
          department: { id: departmentId },
          status: CourseStatusType.PUBLISHED,
        },
        relations: ['department', 'coursePlans'],
      });
      console.log('coursesWithPlans', coursesWithPlans);

      // 找出課程內最低價的方案
      const CoursesLowestPrice = coursesWithPlans.reduce((pre, cur: Course) => {
        const data = { ...pre };
        let lowestPrice = null;
        cur.coursePlans.forEach((coursePlan) => {
          lowestPrice = lowestPrice
            ? Math.min(lowestPrice, coursePlan.price)
            : coursePlan.price;
        });
        data[cur.id] = lowestPrice;
        return data;
      }, {});

      const filterCourses = courseFiles.reduce((prev, cur) => {
        const arr = [...prev];
        if (cur.file_sequence === 1) {
          arr.push(cur);
        }
        return arr;
      }, []);
      console.log('filterCourses', filterCourses);
      const courses = filterCourses.map((course) => ({
        id: course.course_id,
        image: course.file_file_url,
        name: course.course_name,
        description: course.course_description,
        lowestPrice: CoursesLowestPrice[course.course_id] || null,
        courseType: course.course_type,
      }));

      return courses;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getClientCourseDetail(id: string): Promise<GetCourseDetailResponseDTO> {
    try {
      const detail = this.getCourseDetail(id);
      return detail;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
