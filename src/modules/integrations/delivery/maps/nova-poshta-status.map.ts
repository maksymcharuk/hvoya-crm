import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const NovaPoshtaStatusMap: { [n: string]: OrderDeliveryStatus } = {
  'Відправлення передано до відділення': OrderDeliveryStatus.Accepted,
  'Відправлення прийнято': OrderDeliveryStatus.Accepted,
  'Відправлення відправлено': OrderDeliveryStatus.InTransit,
  'Прибув у відділення': OrderDeliveryStatus.Arrived,
  'Відправлення отримано': OrderDeliveryStatus.Received,
  'Відправлення повернуто': OrderDeliveryStatus.Returned,
  'Відправлення відмовлено': OrderDeliveryStatus.Declined,
};

export const getStatus: GetStatusFn = (status: string): OrderDeliveryStatus => {
  return NovaPoshtaStatusMap[status] || OrderDeliveryStatus.Unspecified;
};
