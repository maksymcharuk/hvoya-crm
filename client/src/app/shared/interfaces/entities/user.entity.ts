import { Role } from '@shared/enums/role.enum';

import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  bio: string;
  cardNumber: string;
  cardholderName: string;
  role: Role;
  emailConfirmed: boolean;
  userConfirmed: boolean;
  userFreezed: boolean;

  constructor(data?: User) {
    super(data);
    this.email = data?.email || '';
    this.firstName = data?.firstName || '';
    this.middleName = data?.middleName || '';
    this.lastName = data?.lastName || '';
    this.phoneNumber = data?.phoneNumber || '';
    this.location = data?.location || '';
    this.bio = data?.bio || '';
    this.cardNumber = data?.cardNumber || '';
    this.cardholderName = data?.cardholderName || '';
    this.role = data?.role || Role.User;
    this.emailConfirmed = data?.emailConfirmed || true;
    this.userConfirmed = data?.userConfirmed || true;
    this.userFreezed = data?.userFreezed || false;
  }
}