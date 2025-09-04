import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const message = request.message || 'success';
        // custom code
        const httpStatusCode = request.httpCode;
        // success http code will be always 200 whatever method is
        response.status(
          httpStatusCode ||
            (request.method === 'POST' ? HttpStatus.CREATED : HttpStatus.OK),
        );

        return {
          statusCode: httpStatusCode ?? response.statusCode,
          message,
          result: data,
        };
      }),
    );
  }
}
