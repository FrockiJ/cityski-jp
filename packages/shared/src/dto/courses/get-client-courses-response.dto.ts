import { Expose } from "class-transformer";

export class GetClientCoursesResponseDTO {
  @Expose()
  id: string;

  @Expose()
  image: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  lowestPrice: number;

  @Expose()
  courseType: string;
}
