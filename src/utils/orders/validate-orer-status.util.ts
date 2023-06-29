import { InternalServerErrorException } from '@nestjs/common';

import {
  CANCELABLE_ORDER_STATUSES,
  UNCHANGEABLE_ORDER_STATUSES,
} from '@constants/order.constants';
import { OrderStatus } from '@enums/order-status.enum';
import { getOrderStatusName } from '@interfaces/one-c';

function cannotBeChanged(currenStatus: OrderStatus) {
  return UNCHANGEABLE_ORDER_STATUSES.includes(currenStatus);
}

function cannotBeCanceled(currenStatus: OrderStatus, newStatus: OrderStatus) {
  return (
    newStatus === OrderStatus.Cancelled &&
    !CANCELABLE_ORDER_STATUSES.includes(currenStatus)
  );
}

function cannotBeProcessed(currenStatus: OrderStatus, newStatus: OrderStatus) {
  return (
    newStatus === OrderStatus.Processing && currenStatus !== OrderStatus.Pending
  );
}

export function validateOrderStatus(
  currenStatus: OrderStatus,
  newStatus: OrderStatus,
) {
  switch (true) {
    case cannotBeChanged(currenStatus):
    case cannotBeCanceled(currenStatus, newStatus):
    case cannotBeProcessed(currenStatus, newStatus):
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
