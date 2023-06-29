import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceEntity } from '@entities/balance.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';

import { OneCClientModule } from '@modules/integrations/one-c/one-c-client/one-c-client.module';

import { CaslModule } from '../casl/casl.module';
import { UsersModule } from '../users/users.module';
import { BalanceController } from './balance.controller';
import { BalanceService } from './services/balance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalanceEntity, PaymentTransactionEntity]),
    CaslModule,
    UsersModule,
    OneCClientModule,
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
