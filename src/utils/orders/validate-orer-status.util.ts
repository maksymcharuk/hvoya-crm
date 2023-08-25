import { InternalServerErrorException } from '@nestjs/common';

import { CANCELABLE_ORDER_STATUSES } from '@constants/order.constants';
import { OrderStatus } from '@enums/order-status.enum';
import { getOrderStatusName } from '@interfaces/one-c';

function canBeChanged(currenStatus: OrderStatus, newStatus: OrderStatus) {
  return (
    newStatus === OrderStatus.Cancelled &&
    CANCELABLE_ORDER_STATUSES.includes(currenStatus)
  );
}

export function validateOrderStatus(
  currenStatus: OrderStatus,
  newStatus: OrderStatus,
) {
  switch (true) {
    case canBeChanged(currenStatus, newStatus):
      break;
    default:
      throw new InternalServerErrorException(
        `
          Статус замовлення не може бути змінено з 
          ${getOrderStatusName(currenStatus)}
          на 
          ${getOrderStatusName(newStatus)}
        `,
      );
  }
}
