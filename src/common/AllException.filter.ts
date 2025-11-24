import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response } from 'express';
import { PayloadTooLargeException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

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
    } else if (exception instanceof PayloadTooLargeException) {
      response.status(413).json({
        statusCode: 413,
        message: 'файл невалиден по причине размера',
        error: 'Payload Too Large',
        path,
        timestamp,
      });
    } else if (exception instanceof QueryFailedError) {
      const error = exception.driverError;
      if (
        error.code === '23505' ||
        error.code === 'ER_DUP_ENTRY' ||
        error.code === 'SQLITE_CONSTRAINT_UNIQUE'
      ) {
        response.status(409).json({
          statusCode: 409,
          message: 'ресурс уже существует',
          error: 'Conflict',
          path,
          timestamp,
        });
      }
    }

    return response.status(status).json({
      statusCode: status,
      message,
      timestamp,
      path,
    });
  }
}
