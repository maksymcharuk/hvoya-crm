import { Injectable } from '@nestjs/common';

import { DeliveryService } from '@enums/delivery-service.enum';

import { DeliveryApiService } from '../../services/delivery-api/delivery-api.service';
import { NovaPoshtaApiService } from '../../services/nova-poshta-api/nova-poshta-api.service';
import { UkrPoshtaApiService } from '../../services/ukr-poshta-api/ukr-poshta-api.service';

@Injectable()
export class DeliveryServiceFactory {
  constructor(
    private readonly novaPoshtaApiService: NovaPoshtaApiService,
    private readonly ukrPoshtaApiService: UkrPoshtaApiService,
  ) {}

  getDeliveryService(
    deliveryServiceName: DeliveryService,
  ): DeliveryApiService | null {
    switch (deliveryServiceName) {
      case DeliveryService.NovaPoshta:
        return this.novaPoshtaApiService;
      case DeliveryService.UkrPoshta:
        return this.ukrPoshtaApiService;
      default:
        return null;
    }
  }
}
