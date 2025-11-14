import { ConfigType, registerAs } from '@nestjs/config';
import type { StringValue } from 'ms';

export const configuration = registerAs('APP_CONFIG', () => ({
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'app_db',
  },
  secretToken: process.env.SECRET_TOKEN || 'secret_token',
  secretExpiresIn: (process.env.SECRET_EXPIRES_IN || '1h') as StringValue,
  refreshToken: process.env.REFRESH_TOKEN || 'refresh_token',
  refreshExpiresIn: (process.env.REFRESH_EXPIRES_IN || '7d') as StringValue,
}));

export type IConfig = ConfigType<typeof configuration>;
