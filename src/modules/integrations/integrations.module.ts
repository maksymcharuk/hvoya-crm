import { Module } from '@nestjs/common';

import { DeliveryModule } from './delivery/delivery.module';
import { OneCApiModule } from './one-c/one-c-api/one-c-api.module';
import { OneCClientModule } from './one-c/one-c-client/one-c-client.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [DeliveryModule, PaymentModule, OneCClientModule, OneCApiModule],
  exports: [DeliveryModule, PaymentModule, OneCClientModule, OneCApiModule],
})
export class IntegrationsModule {}
