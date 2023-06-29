import { BasicStrategy as Strategy } from 'passport-http';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { BASIC_AUTH_CREDENTIALS_MAP } from './credentials.map';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (
    _req: Request,
    username: string,
    password: string,
  ): Promise<boolean> => {
    console.log('BasicStrategy.validate');

    if (
      BASIC_AUTH_CREDENTIALS_MAP.has(username) &&
      BASIC_AUTH_CREDENTIALS_MAP.get(username) === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
