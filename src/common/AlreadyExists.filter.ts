import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class ConflictError implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if ((exception.driverError as any)?.code === '23505') {
      response.status(404).json({
        statusCode: 404,
        message: 'запись уже существует',
        error: 'conflict',
      });
    } else {
      throw exception;
    }
  }
}
