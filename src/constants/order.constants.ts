import { DeliveryStatus } from '@enums/delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';

// List of rules for manual order status change

// Only Pending and Processing orders can be canceled
export const CANCELABLE_ORDER_STATUSES = [
  OrderStatus.Pending,
  OrderStatus.Processing,
];

// Order statuses that can't be changed manually
export const UNCHANGEABLE_ORDER_STATUSES = [
  OrderStatus.Fulfilled,
  OrderStatus.Cancelled,
  OrderStatus.Refunded,
  OrderStatus.Refused,
];

// Order statuses that can't be set manually
export const UNSETTABLE_ORDER_STATUSES = [OrderStatus.Refunded];

// Order statuses that require comment
export const COMMENT_REQUIRED_ORDER_STATUSES = [
  OrderStatus.TransferedToDelivery,
  OrderStatus.Fulfilled,
  OrderStatus.Cancelled,
  OrderStatus.Refunded,
  OrderStatus.Refused,
];

export const ORDER_STATUSES_TO_DELIERY_STATUSES = new Map<
  OrderStatus,
  DeliveryStatus
>([
  [OrderStatus.Refused, DeliveryStatus.Declined],
  [OrderStatus.Cancelled, DeliveryStatus.Declined],
  [OrderStatus.Fulfilled, DeliveryStatus.Received],
  [OrderStatus.Refunded, DeliveryStatus.Returned],
]);
