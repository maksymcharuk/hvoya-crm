import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '../casl/casl.module';
import { AccountController } from './account.controller';
import { AccountService } from './services/account.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CaslModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
