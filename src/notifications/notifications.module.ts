import { Module } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { NotificationsGateway } from './notifications.gateway';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [RequestsModule],
  providers: [NotificationsGateway, WsJwtGuard],
  exports: [NotificationsGateway]
})
export class NotificationsModule {}
