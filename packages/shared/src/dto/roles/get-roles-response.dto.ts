import { IsNumber, IsString } from "class-validator";
import { Filter } from "../../decorators/filter";
import { FilterType, OptionNames } from "../../constants/enums";
export class GetRolesResponseDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  usageCount: number;

  @IsNumber()
  status: number;

  // @Filter({
  //   type: FilterType.DATETIME,
  //   startDateKey: "startUpdateDate",
  //   label: "Member since",
  //   options: OptionNames.DATETIME,
  //   sequence: 21,
  //   placeholder: ''
  // })
  @IsNumber()
  superAdm: number;

  @IsString()
  updatedTime: Date;
}
