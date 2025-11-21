import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    const path = request.url;
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      return response.status(status).json({
        statusCode: status,
        message,
        path,
        timestamp,
      });
    } else if (exception instanceof EntityNotFoundError) {
      return response.status(404).json({
        statusCode: 404,
        message: 'ресурс не найден',
        error: 'Not Found',
        path,
        timestamp,
      });
    }

    return response.status(status).json({
      statusCode: status,
      message,
      timestamp,
      path,
    });
  }
}
