import { IsString } from 'class-validator';

import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';

class Status {
  @IsString()
  trackingId: string;

  @IsString()
  date: string;

  @IsString()
  status: OrderDeliveryStatus;

  @IsString()
  rawStatus: string;
}

export class GetDeliveryStatusesResponse {
  statuses: Status[];

  constructor(data?: GetDeliveryStatusesResponse) {
    this.statuses = data?.statuses ?? [];
  }
}
