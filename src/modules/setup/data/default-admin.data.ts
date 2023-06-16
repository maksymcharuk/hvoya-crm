import { CreateUserDto } from '@dtos/create-user.dto';
import { Role } from '@enums/role.enum';

export const DEFAULT_ADMIN_DATA: CreateUserDto = {
  firstName: 'John',
  lastName: 'SuperAdmin',
  middleName: 'Smith',
  email: 'john-super-admin@email.com',
  password: 'Admin12345',
  role: Role.SuperAdmin,
  emailConfirmed: true,
  userConfirmed: true,
  userFreezed: false,
  phoneNumber: '0673344123',
  storeName: 'Hvoya',
  bio: 'I am a super admin',
  accountNumber: '11111',
  website: 'https://hvoya.com',
};
