import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const UkrPoshtaStatusMap: { [n: string]: OrderDeliveryStatus } = {
  'Надходження на сортувальний центр': OrderDeliveryStatus.Accepted,
  'Відправлення у відділенні': OrderDeliveryStatus.Arrived,
  'Відправлення прийняте у відділенні': OrderDeliveryStatus.Arrived,
  'Відправлено до відділення': OrderDeliveryStatus.InTransit,
  'Відправлення посилки': OrderDeliveryStatus.InTransit,
  'Відправлення до ВПЗ': OrderDeliveryStatus.InTransit,
  'Відправлення вручено: особисто': OrderDeliveryStatus.Received,
  'Відправлення вручено': OrderDeliveryStatus.Received,
  'Міжнародне відправлення вручено у країні одержувача':
    OrderDeliveryStatus.Received,
  'Відправлення вручено відправнику': OrderDeliveryStatus.Returned,
  'Повернення відправлення': OrderDeliveryStatus.Returned,
  'Відправлення відмовлено': OrderDeliveryStatus.Declined,
};

export const getStatus: GetStatusFn = (status: string): OrderDeliveryStatus => {
  return UkrPoshtaStatusMap[status] || OrderDeliveryStatus.Unspecified;
};
