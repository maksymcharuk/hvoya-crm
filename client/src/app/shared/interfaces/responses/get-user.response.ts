import { Role } from '@shared/enums/role.enum';

export interface GetUserResponse {
  id: number;
  email: string;
  emailConfirmed: boolean;
  firstNamel: string;
  lastNamel: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
