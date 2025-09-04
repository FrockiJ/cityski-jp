import { HttpStatusCode } from "src/constants/httpStatusCode";

export type ObjectType<T> = { new (): T };

export type PropertyMapper<T> = {
  [K in keyof T]: K;
};

export type PropertyTypeFactory<T> = (
  t: T | PropertyMapper<T>,
) => (string | any)[];

export type ResponseWrapper<T> = {
  statusCode: HttpStatusCode;
  status: string;
  message: string;
  result: T;
};

export type Response = {
  statusCode: HttpStatusCode;
  status: string;
  message: string;
};
