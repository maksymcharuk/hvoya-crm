import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BalanceModule } from '../../../balance/balance.module';
import { PrivatBankController } from './privat-bank.controller';
import { PaymentApiService } from './services/payment-api.service';

@Module({
  imports: [HttpModule, BalanceModule],
  providers: [PaymentApiService],
  controllers: [PrivatBankController],
})
export class PrivatBankModule {}
