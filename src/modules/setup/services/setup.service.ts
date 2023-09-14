import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersPageOptionsDto } from '@dtos/users-page-options.dto';
import { Role } from '@enums/role.enum';

import { UsersService } from '@modules/users/services/users.service';

import { DEFAULT_ADMIN_DATA } from '../data/default-admin.data';
import { TEST_USER_DATA } from '../data/test-user.data';

@Injectable()
export class SetupService {
  defaultAdminData = DEFAULT_ADMIN_DATA;
  testUserData = TEST_USER_DATA;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async setup() {
    await this.createInitialAdmin();
    await this.createTestUser();
  }

  async createInitialAdmin() {
    const admins = await this.usersService.getUsers(
      new UsersPageOptionsDto({ roles: [Role.SuperAdmin] }),
    );

    if (admins.data.length > 0) {
      return;
    }

    try {
      return this.usersService.create({
        ...this.defaultAdminData,
        email:
          this.configService.get<string>('INITIAL_ADMIN_EMAIL') ||
          this.defaultAdminData.email,
        password:
          this.configService.get<string>('INITIAL_ADMIN_PASSWORD') ||
          this.defaultAdminData.password,
      });
    } catch (error) {
      throw error;
    }
  }

  async createTestUser() {
    const user = await this.usersService.findByAccountNumber(
      this.testUserData.accountNumber!,
    );

    if (user) {
      return;
    }

    try {
      return this.usersService.create({
        ...this.testUserData,
        email:
          this.configService.get<string>('TEST_USER_EMAIL') ||
          this.testUserData.email,
        password:
          this.configService.get<string>('TEST_USER_PASSWORD') ||
          this.testUserData.password,
      });
    } catch (error) {
      throw error;
    }
  }
}
