import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client = context.switchToWs().getClient();
    client.user = this.validateToken(client);

    return true;
  }

  validateToken(client: Socket): JwtTokenPayload {
    const { authorization } = client.handshake.headers;
    const token = authorization?.split(' ')[1]!;
    const payload = this.jwtService.verify(token);

    return payload;
  }
}
