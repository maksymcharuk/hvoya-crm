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

import { COMMENT_REQUIRED_ORDER_STATUSES } from '@constants/order.constants';
import { OrderStatus } from '@enums/order-status.enum';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  override trackingId: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  @IsIn([OrderStatus.Cancelled], {
    message: 'Вручну можна змінити статус лише на "Скасовано"',
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
