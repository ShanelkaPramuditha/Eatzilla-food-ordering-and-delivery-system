import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    this.logger.error(`Exception caught: ${JSON.stringify(exception)}`);

    // Handle RPC exceptions with a response property (from microservices)
    if (exception !== null && typeof exception === 'object' && 'response' in exception) {
      const exceptionObj = exception as Record<string, unknown>;
      message =
        typeof exceptionObj.response === 'string'
          ? exceptionObj.response
          : String(exceptionObj.response);

      // Try to parse the status if available
      if ('status' in exceptionObj && typeof exceptionObj.status === 'number') {
        status = exceptionObj.status;
      }
    }
    // Handle standard HTTP exceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    // Handle other error objects with message property
    else if (exception instanceof Error) {
      message = exception.message;
    }
    // Handle other objects with message property
    else if (exception !== null && typeof exception === 'object' && 'message' in exception) {
      message = String((exception as { message: unknown }).message);
    }

    this.logger.error(`Error: ${message} (${status})`);

    const request = ctx.getRequest<Request>();
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

// Helper function to handle RPC exceptions in services
export function catchRpcError<T>(errorMessage: string = 'Service error') {
  return (source: Observable<T>): Observable<T> => {
    return new Observable<T>((subscriber) => {
      source.subscribe({
        next: (value) => subscriber.next(value),
        error: (error) => {
          const logger = new Logger('RpcErrorHandler');

          logger.error(
            `${errorMessage}: ${error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : JSON.stringify(error)}`,
          );

          // Extract message from RPC exception if available
          if (error && typeof error === 'object' && 'response' in error) {
            const rpcError = error as { response: string | Record<string, any>; status?: number };
            return subscriber.error(
              new HttpException(
                rpcError.response,
                rpcError.status || HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          }

          // Generic error handling
          subscriber.error(
            new HttpException(
              `${errorMessage}: ${error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : 'Unknown error'}`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        },
        complete: () => subscriber.complete(),
      });
    });
  };
}
