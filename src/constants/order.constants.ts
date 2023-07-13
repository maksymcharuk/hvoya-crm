import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
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

export const ORDER_STATUSES_TO_DELIERY_STATUSES = new Map<
  OrderStatus,
  OrderDeliveryStatus
>([
  [OrderStatus.Cancelled, OrderDeliveryStatus.Declined],
  [OrderStatus.Fulfilled, OrderDeliveryStatus.Received],
  [OrderStatus.Refunded, OrderDeliveryStatus.Returned],
]);
