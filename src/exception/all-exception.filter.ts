import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { IResponseBody } from 'src/constant/interface';

/**
 * A filter to handle exceptions globally within a Nest.js application.
 *
 * This filter captures unhandled exceptions and provides a consistent response format.
 * It logs detailed information about the exception and sends a well-structured response
 * back to the client.
 *
 * @class
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Constructor for the AllExceptionsFilter class.
   *
   * @constructor
   * @param {HttpAdapterHost} httpAdapterHost - The HTTP adapter host.
   */
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Catches and handles exceptions.
   *
   * @param {any} exception - The exception object.
   * @param {ArgumentsHost} host - The host object.
   * @returns {Promise<void>}
   */
  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    // Extracting the request object from the host
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();

    // Determine the HTTP status code based on the exception type
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Determine the error message based on the exception type
    const error =
      exception instanceof HttpException
        ? exception.name
        : 'Internal server error';

    // Build the response body
    const responseBody: IResponseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      error: error,
      data: exception.response ? exception.response : exception.message,
    };

    this.logger.error(responseBody);

    // If the exception is an instance of HttpException, extract and log additional information
    if (exception instanceof HttpException) {
      const res: any = exception.getResponse();
      this.logger.debug(`all exception error res`, res);
      if (res) responseBody.data = res.message;
    }

    // If the HTTP status is 500, log detailed information about the exception
    if (httpStatus == 500) {
      const meta = {
        url: req.url,
        query: req.query,
        body: req.body,
        user: req.user,
        stack: exception?.stack,
        exception: exception.name,
      };
      this.logger.error({ message: exception.toString(), meta });
    }

    // Reply to the client with the structured response
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
