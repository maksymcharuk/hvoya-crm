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
        storeName: 'Lviv',
        bio: 'I am a super admin',
        balance: await balanceRepository.save({}),
        accountNumber: '11111',
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
        storeName: 'Silpo',
        bio: 'I am an admin',
        balance: await balanceRepository.save({}),
        accountNumber: '22222',
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
        storeName: 'ATB',
        website: 'https://hvoya.com',
        bio: 'I am a user',
        balance: await balanceRepository.save({}),
        accountNumber: '33333',
      },
      {
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
        storeName: 'Whole Foods',
        website: 'https://hvoya.com',
        bio: 'I am a test user',
        balance: await balanceRepository.save({}),
        userTest: true,
        accountNumber: '44444',
      },
    ];
    await repository.save(usersData);
  }
}
