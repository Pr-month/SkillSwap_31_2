import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get<string>('APP_CONFIG.db.host', 'localhost'),
          port: configService.get<number>('APP_CONFIG.db.port', 5432),
          username: configService.get<string>('APP_CONFIG.db.user', 'postgres'),
          password: configService.get<string>('APP_CONFIG.db.password', 'postgres'),
          database: configService.get<string>('APP_CONFIG.db.name', 'app_db'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        })
    }),
  ],
})
export class DatabaseModule {}
