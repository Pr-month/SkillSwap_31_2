import { Module } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { NotificationsGateway } from './notifications.gateway';


@Module({
  imports: [],
  providers: [NotificationsGateway, WsJwtGuard],
  exports: [NotificationsGateway]
})
export class NotificationsModule {}
