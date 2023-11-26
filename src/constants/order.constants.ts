import { DeliveryStatus } from '@enums/delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';

// List of rules for manual order status change

// Only Pending orders can be canceled by users
export const USER_CANCELABLE_ORDER_STATUSES = [OrderStatus.Pending];

// Only Pending and Processing orders can be canceled by admin
export const ADMIN_CANCELABLE_ORDER_STATUSES = [
  OrderStatus.Pending,
  OrderStatus.Processing,
];

// Only Pending orders can be updated by users (e.g. wayblill or tracking number)
export const USER_UPDATEABLE_ORDER_STATUSES = [OrderStatus.Pending];

// Order statuses that can be set manually
export const MANUAL_ORDER_STATUSES = [
  OrderStatus.Fulfilled,
  OrderStatus.Cancelled,
];

// Only Processing orders can be fulfilled
export const FULFILLABLE_ORDER_STATUSES = [OrderStatus.Processing];

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
