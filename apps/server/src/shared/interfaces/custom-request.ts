import { HttpStatusCode } from '@repo/shared';
import { Request } from 'express';

export interface CustomRequest extends Request {
  message?: string;
  httpCode?: HttpStatusCode;
}
