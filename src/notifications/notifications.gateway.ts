import { Inject, UseGuards } from '@nestjs/common';
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
import { RequestsService } from '../requests/requests.service';
import { TJwtPayload } from '../auth/type';

@UseGuards(WsJwtGuard)
@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  @Inject()
  requestsService: RequestsService;

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const data = client.data as { user: TJwtPayload };
    const { sub } = data.user;
    client.join(sub.toString());
  }

  @SubscribeMessage('accepted')
  async handleAccepted(client: Socket, payload: SendRequestDto) {
    const data = client.data as { user: TJwtPayload };
    const { sub } = data.user;
    const requests = await this.requestsService.findIncomming(sub);
    if (!requests.find((request) => request.sender.id == payload.fromUserId)) {
      throw new WsException('Пользователь не найден');
    }

    this.notifyUser(sub, payload);
  }

  @SubscribeMessage('rejected')
  async handleRejected(client: Socket, payload: SendRequestDto) {
    const data = client.data as { user: TJwtPayload };
    const { sub } = data.user;
    const requests = await this.requestsService.findIncomming(sub);
    if (!requests.find((request) => request.sender.id == payload.fromUserId)) {
      throw new WsException('Пользователь не найден');
    }

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
