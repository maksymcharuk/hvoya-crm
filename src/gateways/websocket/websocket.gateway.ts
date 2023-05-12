import { Server, Socket } from 'socket.io';

import { UseGuards } from '@nestjs/common';
import {
  // ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { SocketEvent } from '@enums/socket-event.enum';
import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';

import { WebSocketAuthMiddleware } from './auth/ws-auth.middleware';
import { WsJwtGuard } from './auth/ws-jwt.guard';

interface ConnectionData {
  client: Socket;
  user: JwtTokenPayload['user'];
}

@UseGuards(WsJwtGuard)
@WebSocketGateway({ transports: ['websocket'] })
export class WSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  userIdToConnectionData: { [key: string]: ConnectionData } = {};

  constructor(
    private readonly webSocketAuthMiddleware: WebSocketAuthMiddleware,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocketGateway initialized');
    server.use(this.webSocketAuthMiddleware.use() as any);
  }

  handleConnection(client: Socket) {
    const user = this.getUserFromClient(client);
    this.identify(user, client);
    console.log(`Client connected: ${user.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = this.getUserFromClient(client);
    delete this.userIdToConnectionData[user.id];
    console.log(`Client disconnected: ${user.id}`);
  }

  identify(user: JwtTokenPayload['user'], client: Socket) {
    this.userIdToConnectionData[user.id] = { client, user };
  }

  getUserFromClient(client: Socket) {
    return client.data['user'] as JwtTokenPayload['user'];
  }

  // @SubscribeMessage('notification')
  // async handleMessage(@ConnectedSocket() client: Socket): Promise<void> {
  //   const user = this.getUserFromClient(client);
  //   this.sendNotificationToUser(user.id, 'Hello from server!');
  // }

  sendToUser(userId: string, event: SocketEvent, data: any) {
    this.userIdToConnectionData[userId]?.client.emit(event, data);
  }
}
