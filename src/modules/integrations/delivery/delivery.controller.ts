import { Body, Controller, Post } from '@nestjs/common';

import { GetDeliveryStatusesDto } from '@interfaces/delivery';

import { NovaPoshtaApiService } from './services/nova-poshta-api/nova-poshta-api.service';
import { UkrPoshtaApiService } from './services/ukr-poshta-api/ukr-poshta-api.service';

@Controller()
export class DeliveryController {
  constructor(
    private readonly novaPoshtaApiService: NovaPoshtaApiService,
    private readonly ukrPoshtaApiService: UkrPoshtaApiService,
  ) {}

  @Post('delivery-statuses')
  getDeliveryStatusesNP(@Body() body: GetDeliveryStatusesDto) {
    return this.novaPoshtaApiService.getDeliveryStatuses(body);
  }

  // SA145872310HK
  @Post('delivery-statuses-ukr-poshta')
  getDeliveryStatusesUP(@Body() body: GetDeliveryStatusesDto) {
    return this.ukrPoshtaApiService.getDeliveryStatuses(body);
  }
}
