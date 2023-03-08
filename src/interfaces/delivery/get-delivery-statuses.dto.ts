import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class Document {
  @IsString()
  trackingId: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class GetDeliveryStatusesDto {
  @IsArray()
  @IsNotEmpty()
  trackingInfo: Document[];
}
