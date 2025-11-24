import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration, IConfig } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/AllException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());

  const config = app.get<IConfig>(configuration.KEY);
  await app.listen(config.port);
}
void bootstrap();
