import { DeliveryStatus } from '@enums/delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';

// Map delivery statuses to order statuses
export const DeliveryStatusesToOrderStatuses = new Map<
  DeliveryStatus[],
  OrderStatus
>([
  [[DeliveryStatus.Returned], OrderStatus.Refused],
  [[DeliveryStatus.Declined], OrderStatus.Refused],
  [[DeliveryStatus.Received], OrderStatus.Fulfilled],
  [
    [DeliveryStatus.Accepted, DeliveryStatus.InTransit, DeliveryStatus.Arrived],
    OrderStatus.TransferedToDelivery,
  ],
]);
