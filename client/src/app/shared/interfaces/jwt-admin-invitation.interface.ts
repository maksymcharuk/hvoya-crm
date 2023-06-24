import { Role } from '@shared/enums/role.enum';

export interface JwtAdminInvitation {
  email: string;
  role: Role;
}
