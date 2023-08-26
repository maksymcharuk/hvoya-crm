import { Role } from '@shared/enums/role.enum';

import { Balance } from './balance.entity';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

export class User extends BaseEntity {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  storeName: string;
  website: string;
  role: Role;
  emailConfirmed: boolean;
  userConfirmed: boolean;
  userFreezed: boolean;
  accountNumber: string | null;
  note: string;
  manager?: User | null;
  managedUsers?: User[];

  orders: Order[] | undefined;
  balance: Balance | undefined;

  get fullName(): string {
    return `${this.lastName} ${this.firstName} ${this.middleName}`;
  }

  get isAnyAdmin(): boolean {
    return this.role === Role.SuperAdmin || this.role === Role.Admin;
  }

  get isSuperAdmin(): boolean {
    return this.role === Role.SuperAdmin;
  }

  get isAdmin(): boolean {
    return this.role === Role.Admin;
  }

  get isUser(): boolean {
    return this.role === Role.User;
  }

  constructor(data?: User) {
    super(data);
    this.email = data?.email || '';
    this.firstName = data?.firstName || '';
    this.middleName = data?.middleName || '';
    this.lastName = data?.lastName || '';
    this.phoneNumber = data?.phoneNumber || '';
    this.storeName = data?.storeName || '';
    this.role = data?.role || Role.User;
    this.emailConfirmed =
      data?.emailConfirmed !== undefined ? data.emailConfirmed : true;
    this.userConfirmed =
      data?.userConfirmed !== undefined ? data.userConfirmed : true;
    this.userFreezed =
      data?.userFreezed !== undefined ? data.userFreezed : false;
    this.website = data?.website || '';
    this.accountNumber = data?.accountNumber || null;
    this.orders = data?.orders?.map((order) => new Order(order)) || [];
    this.balance = new Balance(data?.balance);
    this.note = data?.note || '';
    this.manager = data?.manager ? new User(data.manager) : null;
    this.managedUsers = data?.managedUsers?.map((user) => new User(user)) || [];
  }
}
