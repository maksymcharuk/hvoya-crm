import { OrderStatus } from '@enums/order-status.enum';

export const CANCELABLE_ORDER_STATUSES = [
  OrderStatus.Pending,
  OrderStatus.Processing,
];

export const COMPLETED_ORDER_STATUSES = [
  OrderStatus.Cancelled,
  OrderStatus.Fulfilled,
  OrderStatus.Refunded,
];

export const UNCHANGEABLE_ORDER_STATUSES = [
  OrderStatus.TransferedToDelivery,
  ...COMPLETED_ORDER_STATUSES,
];

export const COMMENT_REQUIRED_ORDER_STATUSES = [
  OrderStatus.Cancelled,
  OrderStatus.Fulfilled,
  OrderStatus.Refunded,
  OrderStatus.TransferedToDelivery,
];
