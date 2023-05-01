import { Socket } from 'socket.io';

import { Injectable } from '@nestjs/common';

import { WsJwtGuard } from './ws-jwt.guard';

export type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void): void;
};

@Injectable()
export class WebSocketAuthMiddleware {
  constructor(private readonly wsJwtGuard: WsJwtGuard) {}

  use(): SocketIOMiddleWare {
    return (client, next) => {
      try {
        const token = this.wsJwtGuard.validateToken(client);
        client.data['user'] = token.user;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
