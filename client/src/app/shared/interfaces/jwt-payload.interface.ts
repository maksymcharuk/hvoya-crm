import { TokenUser } from './entities/token-user.entity';

export interface JwtTokenPayload {
  user: TokenUser;
  iat?: number;
}
