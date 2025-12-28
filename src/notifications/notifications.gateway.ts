import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { SendRequestDto } from './dto/sendRequest.dto';
import { RequestStatus } from '../requests/requests.enums';
import { TJwtPayload } from '../auth/type';
import { SocketWithUser } from './type';
import {JwtPayload} from "jsonwebtoken";

@UseGuards(WsJwtGuard)
@WebSocketGateway(Number(process.env.NOTIFICATIONS_WS_PORT) || 4000, {
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.server.emit('auth', client);
  }

  @SubscribeMessage('auth')
  handleAuth(client: SocketWithUser) {
    const data = client.data as { user: JwtPayload };
    const { sub } = data.user;
    if(!sub){
      throw new WsException('Пользователь не найден');
    }
    client.join(sub.toString());
  }

  @SubscribeMessage('accepted')
  async handleAccepted(client: Socket, payload: SendRequestDto) {
    const data = client.data as { user: TJwtPayload };
    const { sub } = data.user;
    this.notifyUser(sub, payload);
  }

  @SubscribeMessage('rejected')
  async handleRejected(client: Socket, payload: SendRequestDto) {
    const data = client.data as { user: TJwtPayload };
    const { sub } = data.user;
    this.notifyUser(sub, payload);
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
