import { ConfigType, registerAs } from '@nestjs/config';
import type { StringValue } from 'ms';

export const jwtConfig = registerAs('JWT_CONFIG', () => ({
  secretToken: process.env.SECRET_TOKEN || 'secret_token',
  secretExpiresIn: (process.env.SECRET_EXPIRES_IN || '1h') as StringValue,
  refreshToken: process.env.REFRESH_TOKEN || 'refresh_token',
  refreshExpiresIn: (process.env.REFRESH_EXPIRES_IN || '7d') as StringValue,
}));

export type IJwtConfig = ConfigType<typeof jwtConfig>;
