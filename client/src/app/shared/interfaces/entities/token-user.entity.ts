import { Role } from '@shared/enums/role.enum';

export class TokenUser {
  id: string;
  role: Role;

  get isUser() {
    return this.role === Role.User;
  }

  get isAdmin() {
    return this.role === Role.Admin;
  }

  get isSuperAdmin() {
    return this.role === Role.SuperAdmin;
  }

  get isAnyAdmin(): boolean {
    return this.role === Role.SuperAdmin || this.role === Role.Admin;
  }

  constructor(data?: TokenUser) {
    this.id = data?.id || '';
    this.role = data?.role || Role.User;
  }
}
