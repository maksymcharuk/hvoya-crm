import { WinstonLogger } from 'nest-winston';

import { Logger, Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';

import { WebSocketAuthMiddleware } from './auth/ws-auth.middleware';
import { WsJwtGuard } from './auth/ws-jwt.guard';
import { WSocketGateway } from './websocket.gateway';

@Module({
  imports: [AuthModule],
  providers: [
    WebSocketAuthMiddleware,
    WSocketGateway,
    WsJwtGuard,
    WinstonLogger,
    Logger,
  ],
  exports: [WSocketGateway],
})
export class WSocketModule {}
