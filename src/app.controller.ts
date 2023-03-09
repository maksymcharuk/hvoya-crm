import { Body, Controller, Post } from '@nestjs/common';

import {
  GetDeliveryStatusesDto,
  GetDeliveryStatusesResponse,
} from '@interfaces/delivery';

import { NovaPoshtaApiService } from './modules/integrations/delivery/services/nova-poshta-api/nova-poshta-api.service';
import { UkrPoshtaApiService } from './modules/integrations/delivery/services/ukr-poshta-api/ukr-poshta-api.service';

@Controller()
export class AppController {
  constructor(
    private readonly novaPoshtaApiService: NovaPoshtaApiService,
    private readonly ukrPoshtaApiService: UkrPoshtaApiService,
  ) {}

  @Post('delivery-statuses')
  getDeliveryStatus(
    @Body() getDeliveryStatusesDto: GetDeliveryStatusesDto,
  ): Promise<GetDeliveryStatusesResponse> {
    return this.novaPoshtaApiService.getDeliveryStatuses(
      getDeliveryStatusesDto,
    );
  }

  @Post('delivery-statuses-ukr-poshta')
  getDeliveryStatusUkrPoshta(
    @Body() getDeliveryStatusesDto: GetDeliveryStatusesDto,
  ): Promise<GetDeliveryStatusesResponse> {
    return this.ukrPoshtaApiService.getDeliveryStatuses(getDeliveryStatusesDto);
  }
}
