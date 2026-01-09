import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TJwtPayload } from '../auth/type';
import { RequestStatus } from '../requests/requests.enums';
import { SocketWithUser } from './type';
import {JwtPayload} from "jsonwebtoken";
import { WsException } from '@nestjs/websockets';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { SendRequestDto } from './dto/sendRequest.dto';

@UseGuards(WsJwtGuard)
@WebSocketGateway(Number(process.env.NOTIFICATIONS_WS_PORT) || 4000, {
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('auth')
  handleAuth(client: SocketWithUser) {
    const data = client.data;
    const { sub } = data.user;
    if(!sub){
      throw new WsException('Пользователь не найден');
    }
    client.join(sub.toString());
  }

  notifyUser(userId: number, payload: SendRequestDto) {
    switch (payload.type) {
      case RequestStatus.inProgress:
        this.server.to(userId.toString()).emit('send-request', payload);
        break;
      case RequestStatus.accepted:
        this.server.to(userId.toString()).emit('send-about-accepted', payload);
        break;
      case RequestStatus.rejected:
        this.server.to(userId.toString()).emit('send-about-rejected', payload);
        break;
    }
  }
}
