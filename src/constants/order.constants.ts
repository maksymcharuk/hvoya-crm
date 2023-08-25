import { DeliveryStatus } from '@enums/delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';

// List of rules for manual order status change

// Only Pending orders can be canceled
export const CANCELABLE_ORDER_STATUSES = [OrderStatus.Pending];

// Only Fulfilled and Refused orders can be returned
export const RETURNABLE_ORDER_STATUSES = [
  OrderStatus.Fulfilled,
  OrderStatus.Refused,
];

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
