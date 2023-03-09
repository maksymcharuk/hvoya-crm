import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';

export type GetStatusFn = (status: string) => OrderDeliveryStatus;
