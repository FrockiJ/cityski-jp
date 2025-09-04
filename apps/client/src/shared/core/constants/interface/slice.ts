import { MultiValue } from "react-select";
import { Option, OptionNames } from "@repo/shared";

export type OptionManagerType = { [_key in OptionNames]?: MultiValue<Option> };
