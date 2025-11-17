import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration, IConfig } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = app.get<IConfig>(configuration.KEY);
  await app.listen(config.port);
}
void bootstrap();
