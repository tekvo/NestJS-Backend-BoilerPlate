import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SKIP_INTERCEPTOR } from '../common/decorators/public.decorator';

export interface Response<T> {
  data: T;
}

/**
 * Interceptor for formatting the response structure.
 * Use this interceptor to format the response structure consistently.
 * @class
 * @implements {NestInterceptor<T, Response<T>>}
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * Constructor for ResponseInterceptor.
   * @constructor
   * @param {Reflector} reflector - The reflector service for metadata retrieval.
   */
  constructor(@Inject() private reflector: Reflector) {}

  /**
   * Intercepts the execution context and modifies the response.
   * @function
   * @param {ExecutionContext} context - The execution context.
   * @param {CallHandler} next - The call handler.
   * @returns {Observable<Response<T>>} - An observable with the modified response.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Check for the SKIP_INTERCEPTOR decorator on the class or method
    const decoratorSkip =
      this.reflector.get(SKIP_INTERCEPTOR, context.getClass()) ||
      this.reflector.get(SKIP_INTERCEPTOR, context.getHandler());

    // If SKIP_INTERCEPTOR is set, skip the interceptor
    if (decoratorSkip) {
      return next.handle();
    }

    // Modify the response structure
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          message: data?.Message,
          statusCode: HttpStatus.OK,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
