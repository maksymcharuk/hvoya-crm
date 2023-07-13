import { OrderStatus } from '@enums/order-status.enum';

export const orderStatusToNameMap = new Map<OrderStatus, string>([
  [OrderStatus.Pending, 'Нове'],
  [OrderStatus.Processing, 'Опрацьовується'],
  [OrderStatus.TransferedToDelivery, 'Відправлено'],
  [OrderStatus.Fulfilled, 'Виконано'],
  [OrderStatus.Cancelled, 'Скасовано'],
  [OrderStatus.Refunded, 'Повернуто'],
]);

export const getOrderStatusName = (status: OrderStatus | undefined) => {
  return (status && orderStatusToNameMap.get(status)) || 'Уточнюється';
};
