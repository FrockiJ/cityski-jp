import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from './custom.exception';

type DefaultResponse = {
  message: unknown;
};

// custom global exception format
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const originResponse = ctx.getResponse<Response>();
    const errorResponse = exception.getResponse() as DefaultResponse;
    const status = exception.getStatus();
    const message = exception.message;
    // const timestamp = new Date().toISOString();

    const responseObject = {
      statusCode: status,
      message:
        exception instanceof CustomException
          ? message
          : errorResponse.message || errorResponse,
    };
    return originResponse.status(status).json(responseObject);
  }
}
