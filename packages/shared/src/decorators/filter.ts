import "reflect-metadata";
import { FilterInfo } from "src/interfaces/decorator";

export function Filter(options?: FilterInfo) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("filterInfo", options, target, propertyKey);
  };
}
