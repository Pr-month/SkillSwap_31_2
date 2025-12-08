import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendRequest')
  handleMessage(client: Socket, payload: any) {
    const recipientId = payload.recipientId;

    if (recipientId) {
      this.server.to(recipientId).emit('requestReceived', {
        senderId: client.id,
        message: payload.message,
      });
    }
  }

  handleConnection(client: Socket) {

  }

  handleDisconnect(client: any) {
      
  }

  afterInit(server: any) {

  }

}
