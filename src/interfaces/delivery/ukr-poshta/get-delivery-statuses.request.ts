import { IsArray, IsString } from 'class-validator';

export class UkrPoshtaGetDeliveryStatusesRequest {
  @IsArray()
  @IsString({ each: true })
  trackingIds: string[];

  constructor(data?: UkrPoshtaGetDeliveryStatusesRequest) {
    this.trackingIds = data?.trackingIds ?? [];
  }
}
