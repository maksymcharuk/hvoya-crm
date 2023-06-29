import { IsIn, IsNotEmpty } from 'class-validator';

import { OrderStatus } from '@enums/order-status.enum';

import { ALLOWED_ORDER_STATUSES } from '../constants/order.constants';

export class UpdateOrderOneCDTO {
  @IsNotEmpty({ message: 'Необхідно вказати статус замовлення' })
  @IsIn(Object.values(ALLOWED_ORDER_STATUSES), {
    message: `Статус замовлення може бути одним із наступних: ${Object.values(
      ALLOWED_ORDER_STATUSES,
    ).join(', ')}`,
  })
  status: OrderStatus;
}
