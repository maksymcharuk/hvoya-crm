import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { UserEntity } from '../../../entities/user.entity';
import { Role } from '../../../enums/role.enum';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);
    const password = '12345';
    await repository.insert([
      {
        firstName: 'John',
        lastName: 'SuperAdmin',
        email: 'john-super-admin@email.com',
        password: password,
        role: Role.SuperAdmin,
        emailConfirmed: true,
        phoneNumber: '0673344123',
        location: 'Lviv',
        bio: 'I am a super admin',
        cardNumber: '5218 5722 2223 2634',
        cardholderName: 'John SuperAdmin',
      },
      {
        firstName: 'Alice',
        lastName: 'Admin',
        email: 'alice-admin@email.com',
        password: password,
        role: Role.Admin,
        emailConfirmed: true,
        phoneNumber: '0671234567',
        location: 'New York',
        bio: 'I am an admin',
        cardNumber: '5218 5722 2223 2634',
        cardholderName: 'Alice Admin',
      },
      {
        firstName: 'Peter',
        lastName: 'User',
        email: 'peter-user@email.com',
        password: password,
        role: Role.User,
        emailConfirmed: true,
        phoneNumber: '0679876543',
        location: 'Lutsk',
        bio: 'I am a user',
        cardNumber: '5218 5722 2223 2634',
        cardholderName: 'Peter User',
      },
    ]);
  }
}
