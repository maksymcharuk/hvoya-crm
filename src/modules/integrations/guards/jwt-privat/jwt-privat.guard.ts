import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiClient } from '@enums/api.enum';

@Injectable()
export class JwtPrivatGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  override handleRequest(err: any, token: any) {
    if (token && token.provider === ApiClient.PrivatBank) {
      return token.provider;
    } else {
      throw err || new UnauthorizedException();
    }
  }
}
