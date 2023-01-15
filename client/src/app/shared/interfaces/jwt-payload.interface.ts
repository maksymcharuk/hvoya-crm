import { Role } from '../enums/role.enum';

export interface JwtTokenPayload {
  user: {
    id: number;
    role: Role;
  };
  iat?: number;
}
