import { Transform, Type, plainToClass } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
  ValidateNested,
} from 'class-validator';

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
  @IsNotIn([DeliveryService.SelfPickup], {
    message: 'Самовивіз не підтримується',
  })
  @IsNotEmpty({ message: 'Необхідно вказати службу доставки' })
  deliveryService: DeliveryService;

  @IsNotEmpty({ message: 'Необхідно вказати товари' })
  @Transform(({ value }) => {
    value = typeof value === 'string' ? JSON.parse(value) : value;
    return value.map((item: any) =>
      plainToClass(OrderReturnRequestItemDto, item),
    );
  })
  @ValidateNested({ each: true, always: true })
  @Type(() => OrderReturnRequestItemDto)
  requestedItems: OrderReturnRequestItemDto[];

  @IsNotEmpty({ message: 'Необхідно вказати номер замовлення' })
  orderNumber: string;
}
