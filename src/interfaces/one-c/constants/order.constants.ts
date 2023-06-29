import { OrderStatus } from '@enums/order-status.enum';

export const ALLOWED_ORDER_STATUSES = [
  OrderStatus.Processing,
  OrderStatus.Cancelled,
];
