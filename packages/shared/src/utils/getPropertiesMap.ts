import { PropertyMapper } from "../interfaces/common";

export function getPropertiesMap<T>(obj: T): PropertyMapper<T> {
  const result: Partial<PropertyMapper<T>> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = key;
    }
  }
  return result as PropertyMapper<T>;
}
