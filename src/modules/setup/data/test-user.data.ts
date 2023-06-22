import { CreateUserDto } from '@dtos/create-user.dto';
import { Role } from '@enums/role.enum';

export const TEST_USER_DATA: CreateUserDto = {
  firstName: 'Test',
  lastName: 'Test',
  middleName: 'Test',
  email: 'test-user@email.com',
  password: 'Test12345',
  role: Role.User,
  emailConfirmed: true,
  userConfirmed: true,
  userFreezed: false,
  phoneNumber: '0679876542',
  storeName: 'Hvoya',
  website: 'https://hvoya.com',
  bio: 'I am a test user',
  userTest: true,
  accountNumber: '44444',
  note: 'Test user',
};
