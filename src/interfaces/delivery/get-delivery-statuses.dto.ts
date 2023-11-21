import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TrackingInfo {
  @IsString()
  trackingId: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class GetDeliveryStatusesDto {
  @IsArray()
  @IsNotEmpty()
  trackingInfo: TrackingInfo[];
}
