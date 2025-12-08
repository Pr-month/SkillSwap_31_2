import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@UseGuards(WsJwtGuard)
@WebSocketGateway()
export class NotificationsGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
