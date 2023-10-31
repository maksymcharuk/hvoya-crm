import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

import { DeliveryService } from '@enums/delivery-service.enum';

export class UpdateOrderByCustomerDto {
  @ValidateIf(
    (o) =>
      o.deliveryService && o.deliveryService !== DeliveryService.SelfPickup,
  )
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  trackingId?: string;

  @ValidateIf((o) => o.trackingId)
  @IsEnum(DeliveryService)
  @IsNotEmpty({ message: 'Необхідно вказати службу доставки' })
  deliveryService: DeliveryService;

  @IsOptional()
  customerNote?: string;
}
