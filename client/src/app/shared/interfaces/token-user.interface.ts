import { Role } from '@shared/enums/role.enum';

export interface TokenUser {
  id: string;
  role: Role;
}
