import { Body, Controller, Post } from '@nestjs/common';

import {
  GetDeliveryStatusesDto,
  GetDeliveryStatusesResponse,
} from '@interfaces/delivery';

import { NovaPoshtaApiService } from './modules/integrations/delivery/services/nova-poshta-api/nova-poshta-api.service';

@Controller()
export class AppController {
  constructor(private readonly novaPoshtaApiService: NovaPoshtaApiService) {}

  @Post('delivery-statuses')
  getDeliveryStatus(
    @Body() getDeliveryStatusesDto: GetDeliveryStatusesDto,
  ): Promise<GetDeliveryStatusesResponse> {
    return this.novaPoshtaApiService.getDeliveryStatuses(
      getDeliveryStatusesDto,
    );
  }
}
