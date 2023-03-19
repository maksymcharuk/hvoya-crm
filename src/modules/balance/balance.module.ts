import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceEntity } from '@entities/balance.entity';

import { BalanceController } from './balance.controller';
import { BalanceService } from './services/balance.service';
import { CaslModule } from '../casl/casl.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity]), CaslModule, UsersModule],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService]
})
export class BalanceModule { }
