import { Role } from '@enums/role.enum';

export interface JwtTokenPayload {
  user: {
    id: string;
    role: Role;
  };
  iat?: number;
}
