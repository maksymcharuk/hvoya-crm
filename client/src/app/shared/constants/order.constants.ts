import { OrderStatus } from '@shared/enums/order-status.enum';

export const WAYBILL_ACCEPTABLE_FILE_FORMATS = '.pdf';

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
