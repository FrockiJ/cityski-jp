import { Expose, Type } from 'class-transformer';

class CourseInfoDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

class CoursePlanDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => CourseInfoDto)
  course: CourseInfoDto;
}

class OrderDetailDto {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  type: string;

  @Expose()
  @Type(() => CoursePlanDto)
  coursePlan?: CoursePlanDto;
}

class InviterInfoDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class ValidateInvitationResponseDto {
  @Expose()
  valid: boolean;

  @Expose()
  message?: string;

  @Expose()
  inviteeType?: string;

  @Expose()
  @Type(() => OrderDetailDto)
  order?: OrderDetailDto;

  @Expose()
  @Type(() => InviterInfoDto)
  inviter?: InviterInfoDto;

  @Expose()
  expiresAt?: Date;
}
