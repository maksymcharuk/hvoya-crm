import { Module } from '@nestjs/common';

import { DeliveryModule } from './delivery/delivery.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [DeliveryModule, PaymentModule],
  exports: [DeliveryModule, PaymentModule],
})
export class IntegrationsModule {}
