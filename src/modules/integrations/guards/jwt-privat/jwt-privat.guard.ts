import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Api } from '@enums/api.enum';

@Injectable()
export class JwtPrivatGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  override handleRequest(err: any, token: any) {
    if (token && token.provider === Api.PrivatBank) {
      return token.provider;
    } else {
      throw err || new UnauthorizedException();
    }
  }
}
