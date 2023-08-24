import { DeliveryStatus } from '@enums/delivery-status.enum';

export type GetStatusFn = (status: string) => DeliveryStatus;
