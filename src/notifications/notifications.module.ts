import { Module } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({})
export class NotificationsModule {
  provides: [WsJwtGuard];
}
