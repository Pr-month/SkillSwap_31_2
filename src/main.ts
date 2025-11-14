import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration, IConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<IConfig>(configuration.KEY);
  await app.listen(config.port);
}
void bootstrap();
