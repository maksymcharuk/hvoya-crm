import { Role } from '@shared/enums/role.enum';

import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  storeName: string;
  bio: string;
  role: Role;
  emailConfirmed: boolean;
  userConfirmed: boolean;
  userFreezed: boolean;

  get fullName(): string {
    return `${this.lastName} ${this.firstName} ${this.middleName}`;
  }

  constructor(data?: User) {
    super(data);
    this.email = data?.email || '';
    this.firstName = data?.firstName || '';
    this.middleName = data?.middleName || '';
    this.lastName = data?.lastName || '';
    this.phoneNumber = data?.phoneNumber || '';
    this.storeName = data?.storeName || '';
    this.bio = data?.bio || '';
    this.role = data?.role || Role.User;
    this.emailConfirmed =
      data?.emailConfirmed !== undefined ? data.emailConfirmed : true;
    this.userConfirmed =
      data?.userConfirmed !== undefined ? data.userConfirmed : true;
    this.userFreezed =
      data?.userFreezed !== undefined ? data.userFreezed : false;
  }
}
