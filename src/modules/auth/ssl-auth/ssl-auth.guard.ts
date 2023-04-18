import { Request } from 'express';
import { Observable } from 'rxjs';
import { TLSSocket } from 'tls';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SslAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const socket = context.switchToHttp().getRequest<Request>()
      .socket as TLSSocket;
    console.group('#------------- SSL Authorization -------------#');
    console.log('Client authorized: ', socket.authorized);
    console.groupEnd();
    return socket.authorized;
  }
}
