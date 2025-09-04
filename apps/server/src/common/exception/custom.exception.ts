import { HttpException, HttpStatus } from '@nestjs/common';

// Restrict HttpCode passed to exception to exclude common success codes
type HttpErrorStatusWithoutOK = Exclude<HttpStatus, HttpStatus.OK>;
type HttpErrorStatus = Exclude<HttpErrorStatusWithoutOK, HttpStatus.CREATED>;

/**
 * Custom Exception
 * Allows for throwing of a custom error that formats the API response
 * with the error code and message.
 **/
export class CustomException extends HttpException {
  constructor(message: string, httpStatus: HttpErrorStatus) {
    super(message, httpStatus);
  }
}
