import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/app.config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { dbConfiguration } from './config/db.config';
import { IJwtConfig, jwtConfig } from './config/jwt.config';
import { SkillsModule } from './skills/skills.module';
import { UploadModule } from './upload/upload.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, dbConfiguration, jwtConfig],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [jwtConfig.KEY],
      useFactory: (config: IJwtConfig) => ({
        secret: config.secretToken,
        signOptions: { expiresIn: config.secretExpiresIn },
      }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    SkillsModule,
    UploadModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
