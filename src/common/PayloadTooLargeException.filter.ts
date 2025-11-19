import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { PayloadTooLargeException } from '@nestjs/common';

@Catch(PayloadTooLargeException)
export class PayloadTooLargeFilter implements ExceptionFilter {
  catch(exception: PayloadTooLargeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(413).json({
      statusCode: 413,
      message: 'файл невалиден по причине размера',
      error: 'Payload Too Large',
    });
  }
}
