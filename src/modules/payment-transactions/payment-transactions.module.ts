import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '@modules/casl/casl.module';

import { PaymentTransactionsController } from './payment-transactions.controller';
import { PaymentTransactionsService } from './services/payment-transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PaymentTransactionEntity]),
    CaslModule,
  ],
  controllers: [PaymentTransactionsController],
  providers: [PaymentTransactionsService],
  exports: [PaymentTransactionsService],
})
export class PaymentTransactionsModule {}
