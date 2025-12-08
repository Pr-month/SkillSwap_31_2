import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration, IConfig } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/AllException.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SkillSwap API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(config.port);
}
void bootstrap();
