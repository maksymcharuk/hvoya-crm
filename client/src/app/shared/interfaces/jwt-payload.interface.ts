import { TokenUser } from './token-user.interface';

export interface JwtTokenPayload {
  user: TokenUser;
  iat?: number;
}
