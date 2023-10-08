import { InternalServerErrorException } from '@nestjs/common';

import {
  CANCELABLE_ORDER_STATUSES,
  MANUAL_ORDER_STATUSES,
} from '@constants/order.constants';
import { OrderStatus } from '@enums/order-status.enum';
import { getOrderStatusName } from '@interfaces/one-c';

function canBeSetMannualy(newStatus: OrderStatus) {
  return MANUAL_ORDER_STATUSES.includes(newStatus);
}

function canBeCancelled(currenStatus: OrderStatus, newStatus: OrderStatus) {
  if (newStatus === OrderStatus.Cancelled) {
    return CANCELABLE_ORDER_STATUSES.includes(currenStatus);
  }
  return true;
}

export function validateOrderStatus(
  currenStatus: OrderStatus,
  newStatus: OrderStatus,
) {
  switch (true) {
    case !canBeSetMannualy(newStatus):
    case !canBeCancelled(currenStatus, newStatus):
      throw new InternalServerErrorException(
        `
          Статус замовлення не може бути змінено з 
          ${getOrderStatusName(currenStatus)}
          на 
          ${getOrderStatusName(newStatus)}
        `,
      );
    default:
      break;
  }
}
