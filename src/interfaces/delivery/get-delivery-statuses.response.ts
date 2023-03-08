import { IsString } from 'class-validator';

class Status {
  @IsString()
  trackingId: string;

  @IsString()
  date: string;

  @IsString()
  status: string;
}

export class GetDeliveryStatusesResponse {
  statuses: Status[];

  constructor(data?: GetDeliveryStatusesResponse) {
    this.statuses = data?.statuses ?? [];
  }
}
