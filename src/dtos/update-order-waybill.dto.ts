import { IsNotEmpty } from 'class-validator';

export class UpdateOrderWaybillDto {
  @IsNotEmpty()
  trackingId?: string;
}
