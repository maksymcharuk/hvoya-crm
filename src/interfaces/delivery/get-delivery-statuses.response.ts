import { IsString } from 'class-validator';

import { DeliveryStatus } from '@enums/delivery-status.enum';

export class DeliveryServiceRawStatus {
  @IsString()
  trackingId: string;

  @IsString()
  date: string;

  @IsString()
  status: DeliveryStatus;

  @IsString()
  rawStatus: string;
}

export class GetDeliveryStatusesResponse {
  statuses: DeliveryServiceRawStatus[];

  constructor(data?: GetDeliveryStatusesResponse) {
    this.statuses = data?.statuses ?? [];
  }
}
