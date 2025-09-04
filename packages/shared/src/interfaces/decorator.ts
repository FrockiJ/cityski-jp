import { MenuPlacement } from "react-select";
import { FilterType, OptionNames } from "src/constants/enums";

export interface FilterInfo {
  type?: FilterType;
  label?: string;
  options: OptionNames;
  sequence?: number;
  startDateKey?: string;
  endDateKey?: string;
  placeholder?: string;
  menuPlacement?: MenuPlacement;
}
