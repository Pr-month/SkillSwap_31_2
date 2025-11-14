import { ConfigType, registerAs } from '@nestjs/config';
import type { StringValue } from 'ms';

export const configuration = registerAs('APP_CONFIG', () => ({
  port: Number(process.env.PORT) || 3000,
  secretToken: process.env.SECRET_TOKEN || 'secret_token',
  secretExpiresIn: (process.env.SECRET_EXPIRES_IN || '1h') as StringValue,
  environment: process.env.NODE_ENV || 'development',
  refreshToken: process.env.REFRESH_TOKEN || 'refresh_token',
  refreshExpiresIn: (process.env.REFRESH_EXPIRES_IN || '7d') as StringValue,
}));

export type IConfig = ConfigType<typeof configuration>;
