import { Logger, Module } from '@nestjs/common';

import { WebSocketAuthMiddleware } from './auth/ws-auth.middleware';
import { WsJwtGuard } from './auth/ws-jwt.guard';
import { WSocketGateway } from './websocket.gateway';

@Module({
  providers: [WebSocketAuthMiddleware, WSocketGateway, WsJwtGuard, Logger],
  exports: [WSocketGateway],
})
export class WSocketModule {}
