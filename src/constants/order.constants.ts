import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';

// Fulfilled order can only be changed to Cancelled or Refunded
export const REVERTABLE_ORDER_STATUSES = [
  OrderStatus.Cancelled,
  OrderStatus.Refunded,
];

// Pending, Processing, Fulfilled orders can be canceled
export const CANCELABLE_ORDER_STATUSES = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Fulfilled,
];

// Pending, Processing, Fulfilled orders can be refunded
export const REFUNDABLE_ORDER_STATUSES = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Fulfilled,
];

// Final order statuses (except Fulfilling that can't be canceled or refunded)
export const COMPLETED_ORDER_STATUSES = [
  OrderStatus.Cancelled,
  OrderStatus.Fulfilled,
  OrderStatus.Refunded,
];

// Order statuses that can't be changed manually
export const UNCHANGEABLE_ORDER_STATUSES = [
  OrderStatus.TransferedToDelivery,
  OrderStatus.Cancelled,
  OrderStatus.Refunded,
];

// Order statuses that require comment
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
