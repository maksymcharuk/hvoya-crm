import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/modules/users/services/users.service';

import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';

@WebSocketGateway({ transports: ['websocket'] })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(_server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('notification')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log(`Received message from client: `, data);
    const token = client.handshake.headers.authorization?.replace(
      'Bearer ',
      '',
    );

    if (!token) {
      throw new HttpException('Немає токена', HttpStatus.BAD_REQUEST);
    }

    const decodedToken = this.jwtService.verify(token) as JwtTokenPayload;

    if (!decodedToken) {
      throw new HttpException('Недійсний токен', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findById(decodedToken.user.id);

    // Process the received message and send a response if needed
    this.server.emit('response', `Hello ${user?.firstName} ${user?.lastName}`);
  }
}
