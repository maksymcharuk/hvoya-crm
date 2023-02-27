import { Role } from '@shared/enums/role.enum';

export interface GetUserResponse {
  id: number;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  bio: string;
  cardNumber: string;
  cardholderName: string;
  password: string;
  role: Role;
  emailConfirmed: boolean;
  userConfirmed: boolean;
  userFreezed: boolean;
  createdAt: string;
  updatedAt: string;
}
