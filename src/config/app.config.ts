import { ConfigType, registerAs } from '@nestjs/config';

export const configuration = registerAs('APP_CONFIG', () => ({
  port: Number(process.env.PORT) || 3000,
  environment: process.env.NODE_ENV || 'development',
  hashSalt: process.env.HASH_SALT || 10,
}));

export type IConfig = ConfigType<typeof configuration>;
