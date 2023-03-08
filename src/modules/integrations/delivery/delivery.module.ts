import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NovaPoshtaApiService } from './services/nova-poshta-api/nova-poshta-api.service';

@Module({
  imports: [HttpModule],
  providers: [NovaPoshtaApiService],
  exports: [NovaPoshtaApiService],
})
export class DeliveryModule {}
