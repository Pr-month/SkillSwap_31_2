import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfiguration, IDbConfig } from '../config/db.config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [dbConfiguration.KEY],
      useFactory: (config: IDbConfig) => config,
    }),
  ],
})
export class DatabaseModule {}
