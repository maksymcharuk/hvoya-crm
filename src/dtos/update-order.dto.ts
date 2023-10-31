import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import {
  COMMENT_REQUIRED_ORDER_STATUSES,
  MANUAL_ORDER_STATUSES,
} from '@constants/order.constants';
import { DeliveryService } from '@enums/delivery-service.enum';
import { OrderStatus } from '@enums/order-status.enum';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @ValidateIf(
    (o) =>
      o.deliveryService && o.deliveryService !== DeliveryService.SelfPickup,
  )
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  override trackingId?: string;

  @ValidateIf((o) => o.trackingId)
  @IsEnum(DeliveryService)
  @IsNotEmpty({ message: 'Необхідно вказати службу доставки' })
  override deliveryService?: DeliveryService;

  @IsOptional()
  @IsEnum(OrderStatus)
  @IsIn(MANUAL_ORDER_STATUSES, {
    message: 'Вручну можна змінити статус лише на "Скасовано" або "Виконано"',
  })
  orderStatus?: OrderStatus;

  @ValidateIf((o) => {
    return [COMMENT_REQUIRED_ORDER_STATUSES].includes(o.orderStatus);
  })
  @IsNotEmpty({ message: 'Необхідно вказати причину зміни на даний статус' })
  orderStatusComment?: string;

  @IsOptional()
  managerNote?: string;
}
