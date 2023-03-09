import { IsString } from 'class-validator';

export class UkrPoshtaGetDeliveryStatusesResponse {
  @IsString()
  barcode: string;

  @IsString()
  date: string;

  @IsString()
  eventName: string;

  constructor(data?: UkrPoshtaGetDeliveryStatusesResponse) {
    this.barcode = data?.barcode ?? '';
    this.date = data?.date ?? '';
    this.eventName = data?.eventName ?? '';
  }
}
