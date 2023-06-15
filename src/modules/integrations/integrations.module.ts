import { Module } from '@nestjs/common';

import { DeliveryModule } from './delivery/delivery.module';
import { OneCModule } from './one-c/one-c.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [DeliveryModule, PaymentModule, OneCModule],
  exports: [DeliveryModule, PaymentModule, OneCModule],
})
export class IntegrationsModule {}
