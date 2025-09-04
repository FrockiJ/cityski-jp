import { MultiValue } from "react-select";
import { OptionNames } from "../constants/enums";
import { Option } from "./layout";

export type OptionManagerType = { [_key in OptionNames]?: MultiValue<Option> };
