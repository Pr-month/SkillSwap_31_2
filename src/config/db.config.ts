import { ConfigType, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
export const dbConfiguration = registerAs(
  'DB_CONFIG',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'app_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
  }),
);

export type IDbConfig = ConfigType<typeof dbConfiguration>;

export const AppDataSource = new DataSource(dbConfiguration());
