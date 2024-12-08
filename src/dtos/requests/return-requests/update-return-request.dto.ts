import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsEnum, IsNotIn, IsOptional } from 'class-validator';

import { DeliveryService } from '@enums/delivery-service.enum';

export class UpdateReturnRequestDto {
  @IsEnum(DeliveryService)
  @IsNotIn([DeliveryService.SelfPickup], {
    message: 'Самовивіз не підтримується',
  })
  @IsOptional()
  deliveryService?: DeliveryService;

  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  @IsOptional()
  trackingId?: string;
}
