import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const NovaPoshtaStatusMap: { [n: string]: OrderDeliveryStatus } = {
  'Відправлення прийнято': OrderDeliveryStatus.Accepted,
  'Відправлення відправлено': OrderDeliveryStatus.Sent,
  'Відправлення отримано': OrderDeliveryStatus.Received,
  'Відправлення повернуто': OrderDeliveryStatus.Returned,
  'Відправлення відмовлено': OrderDeliveryStatus.Declined,
  'Відправлення передано до відділення': OrderDeliveryStatus.Processing,
};

export const getStatus: GetStatusFn = (status: string): OrderDeliveryStatus => {
  return NovaPoshtaStatusMap[status] || OrderDeliveryStatus.Processing;
};
