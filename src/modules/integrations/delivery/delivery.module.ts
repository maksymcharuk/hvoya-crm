import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DeliveryServiceFactory } from './factories/delivery-service/delivery-service.factory';
import { DeliveryTasksService } from './services/delivery-tasks/delivery-tasks.service';
import { OrderDeliveryStatusUpdateService } from './services/delivery-tasks/services/order-delivery-status-update.service';
import { ReturnRequestDeliveryStatusUpdateService } from './services/delivery-tasks/services/return-request-delivery-status-update.service';
import { MeestPoshtaApiService } from './services/meest-poshta-api/meest-poshta-api.service';
import { NovaPoshtaApiService } from './services/nova-poshta-api/nova-poshta-api.service';
import { UkrPoshtaApiService } from './services/ukr-poshta-api/ukr-poshta-api.service';

@Module({
  imports: [HttpModule],
  providers: [
    NovaPoshtaApiService,
    UkrPoshtaApiService,
    MeestPoshtaApiService,
    DeliveryServiceFactory,
    DeliveryTasksService,
    OrderDeliveryStatusUpdateService,
    ReturnRequestDeliveryStatusUpdateService,
  ],
  exports: [DeliveryServiceFactory],
})
export class DeliveryModule {}
