import { Module } from '@nestjs/common';

import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [DeliveryModule],
  exports: [DeliveryModule],
})
export class IntegrationsModule {}
