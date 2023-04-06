import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PrivatBankController } from './privat-bank.controller';
import { PaymentApiService } from './services/payment-api.service';
import { BalanceModule } from '../../../balance/balance.module';

@Module({
  imports: [HttpModule, BalanceModule],
  providers: [PaymentApiService],
  controllers: [PrivatBankController],
})
export class PrivatBankModule { }
