import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DeliveryServiceFactory } from './factories/delivery-service/delivery-service.factory';
import { DeliveryTasksService } from './services/delivery-tasks/delivery-tasks.service';
import { NovaPoshtaApiService } from './services/nova-poshta-api/nova-poshta-api.service';
import { UkrPoshtaApiService } from './services/ukr-poshta-api/ukr-poshta-api.service';

@Module({
  imports: [HttpModule],
  providers: [
    NovaPoshtaApiService,
    UkrPoshtaApiService,
    DeliveryServiceFactory,
    DeliveryTasksService,
  ],
  exports: [NovaPoshtaApiService, UkrPoshtaApiService],
})
export class DeliveryModule {}
