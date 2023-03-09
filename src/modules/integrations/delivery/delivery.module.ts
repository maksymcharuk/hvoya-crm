import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NovaPoshtaApiService } from './services/nova-poshta-api/nova-poshta-api.service';
import { UkrPoshtaApiService } from './services/ukr-poshta-api/ukr-poshta-api.service';

@Module({
  imports: [HttpModule],
  providers: [NovaPoshtaApiService, UkrPoshtaApiService],
  exports: [NovaPoshtaApiService, UkrPoshtaApiService],
})
export class DeliveryModule {}
