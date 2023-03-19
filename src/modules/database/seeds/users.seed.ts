import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { BalanceEntity } from '../../../entities/balance.entity';
import { UserEntity } from '../../../entities/user.entity';
import { Role } from '../../../enums/role.enum';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);
    const balanceRepository = dataSource.getRepository(BalanceEntity);
    const usersData: Partial<UserEntity>[] = [
      {
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
        location: 'Lviv',
        bio: 'I am a super admin',
        cardNumber: '5218 5722 2223 2634',
        cardholderName: 'John SuperAdmin',
        balance: await balanceRepository.save({})
      },
      {
        firstName: 'Alice',
        lastName: 'Admin',
        middleName: 'Anderson',
        email: 'alice-admin@email.com',
        password: 'Admin12345',
        role: Role.Admin,
        emailConfirmed: true,
        userConfirmed: true,
        userFreezed: false,
        phoneNumber: '0671234567',
        location: 'New York',
        bio: 'I am an admin',
        cardNumber: '5218 5722 2223 2634',
        cardholderName: 'Alice Admin',
        balance: await balanceRepository.save({})
      },
      {
        firstName: 'Peter',
        lastName: 'User',
        middleName: 'Parker',
        email: 'peter-user@email.com',
        password: 'User12345',
        role: Role.User,
        emailConfirmed: true,
        userConfirmed: true,
        userFreezed: false,
        phoneNumber: '0679876543',
        location: 'Lutsk',
        bio: 'I am a user',
        cardNumber: '5218 5722 2223 2634',
        cardholderName: 'Peter User',
        balance: await balanceRepository.save({})
      },
    ];
    await repository.insert(usersData);
  }
}
