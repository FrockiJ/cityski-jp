import { FilterInfo } from "@repo/shared";

import "reflect-metadata";

export function Filter(options?: FilterInfo) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("filterInfo", options, target, propertyKey);
  };
}
