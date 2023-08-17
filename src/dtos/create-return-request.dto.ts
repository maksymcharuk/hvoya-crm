import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsEnum, IsNotEmpty } from 'class-validator';

import { DeliveryService } from '@enums/delivery-service.enum';

export class OrderReturnRequestItemDto {
  @IsNotEmpty({ message: 'Необхідно вказати кількість' })
  quantity: number;

  @IsNotEmpty({ message: 'Необхідно вказати замовлення' })
  orderItemId: string;
}

export class CreateReturnRequestDto {
  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  trackingId: string;

  @IsEnum(DeliveryService)
  @IsNotEmpty({ message: 'Необхідно вказати службу доставки' })
  deliveryService: DeliveryService;

  @IsNotEmpty({ message: 'Необхідно вказати товари' })
  requestedItems: OrderReturnRequestItemDto[];

  @IsNotEmpty({ message: 'Необхідно вказати номер замовлення' })
  orderNumber: string;
}
