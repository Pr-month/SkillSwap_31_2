import { ConfigType, registerAs } from '@nestjs/config';

export const configuration = registerAs('APP_CONFIG', () => ({
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || '5432',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'app_db',
  },
  secretToken: process.env.SECRET_TOKEN || 'secret_token'
}));

export type IConfig = ConfigType<typeof configuration>;
