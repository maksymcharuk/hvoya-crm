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

// Order statuses when order can not be updated
export const UNUPDATABLE_ORDER_STATUSES = [
  OrderStatus.Fulfilled,
  OrderStatus.Cancelled,
  OrderStatus.Refunded,
  OrderStatus.Refused,
];

// Only Fulfilled and Refused orders can be returned
export const RETURNABLE_ORDER_STATUSES = [
  OrderStatus.Fulfilled,
  OrderStatus.Refused,
];
