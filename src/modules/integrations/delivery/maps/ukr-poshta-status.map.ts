import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const UkrPoshtaStatusMap: { [n: string]: OrderDeliveryStatus } = {
  'Відправлення прийняте у відділенні': OrderDeliveryStatus.Accepted,
  'Відправлення у відділенні': OrderDeliveryStatus.Sent,
  'Відправлення відмовлено': OrderDeliveryStatus.Declined,
  'Надходження на сортувальний центр': OrderDeliveryStatus.Processing,
  'Відправлення посилки': OrderDeliveryStatus.Processing,
  'Відправлення до ВПЗ': OrderDeliveryStatus.Processing,
  'Відправлено до відділення': OrderDeliveryStatus.Processing,
  'Відправлення не вручено під час доставки': OrderDeliveryStatus.Processing,
  'Відправлення вручено: особисто': OrderDeliveryStatus.Received,
  'Відправлення вручено': OrderDeliveryStatus.Received,
  'Міжнародне відправлення вручено у країні одержувача':
    OrderDeliveryStatus.Received,
  'Відправлення вручено відправнику': OrderDeliveryStatus.Returned,
  'Повернення відправлення': OrderDeliveryStatus.Returned,
};

export const getStatus: GetStatusFn = (status: string): OrderDeliveryStatus => {
  return UkrPoshtaStatusMap[status] || OrderDeliveryStatus.Processing;
};
