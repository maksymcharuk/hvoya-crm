import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@modules/users/users.module';

import { CaslModule } from '../casl/casl.module';
import { AccountController } from './account.controller';
import { AccountService } from './services/account.service';

@Module({
  imports: [TypeOrmModule.forFeature(), CaslModule, UsersModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
