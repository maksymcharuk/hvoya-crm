import { OrderStatus } from '@shared/enums/order-status.enum';

export const WAYBILL_ACCEPTABLE_FILE_FORMATS = '.pdf';
export const IMAGE_ACCEPTABLE_FILE_FORMATS = '.jpg, .jpeg, .png';

// Order statuses that require comment
export const COMMENT_REQUIRED_ORDER_STATUSES = [
  OrderStatus.TransferedToDelivery,
  OrderStatus.Fulfilled,
  OrderStatus.Cancelled,
  OrderStatus.Refunded,
  OrderStatus.Refused,
];

// Order statuses when order can be updated
export const UPDATABLE_ORDER_STATUSES = [OrderStatus.Pending];

// Order statuses that can be set manually
export const MANUAL_ORDER_STATUSES = [
  OrderStatus.Cancelled,
];

// Only Fulfilled and Refused orders can be returned
export const RETURNABLE_ORDER_STATUSES = [
  OrderStatus.Fulfilled,
  OrderStatus.Refused,
];
