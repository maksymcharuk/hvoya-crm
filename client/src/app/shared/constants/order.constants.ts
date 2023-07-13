import { OrderStatus } from '@shared/enums/order-status.enum';

export const WAYBILL_ACCEPTABLE_FILE_FORMATS = '.pdf';

export const STATUS_RESTRICTED_ORDER_STATUSES = [
  OrderStatus.TransferedToDelivery,
  OrderStatus.Cancelled,
  OrderStatus.Fulfilled,
  OrderStatus.Refunded,
];

export const COMPLETED_ORDER_STATUSES = [
  OrderStatus.Cancelled,
  OrderStatus.Fulfilled,
  OrderStatus.Refunded,
];
