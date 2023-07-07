import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const UkrPoshtaStatusMap: { [key in OrderDeliveryStatus]: string[] } = {
  [OrderDeliveryStatus.Accepted]: [
    'надходження',
    'прийняте',
    'прийнято',
    'у сортувальному центрі',
  ],
  [OrderDeliveryStatus.InTransit]: [
    'до відділення',
    'відправлення посилки',
    'слідує',
    'прямує до точки видачі',
  ],
  [OrderDeliveryStatus.Arrived]: [
    'у відділенні',
    'прибуло',
    'очікує приймання',
    'у точці видачі',
  ],
  [OrderDeliveryStatus.Received]: ['вручено'],
  [OrderDeliveryStatus.Returned]: ['поверн'],
  [OrderDeliveryStatus.Declined]: ['відмовлено', 'скасовано'],
  [OrderDeliveryStatus.Unspecified]: [],
  [OrderDeliveryStatus.Pending]: [],
};

export const getStatus: GetStatusFn = (status: string): OrderDeliveryStatus => {
  // If status string contains any tag in UkrPoshtaStatusMap, return the key else return Unspecified
  return (
    (Object.keys(UkrPoshtaStatusMap).find((key: OrderDeliveryStatus) => {
      return UkrPoshtaStatusMap[key].some((tag) => {
        return status.toLowerCase().includes(tag.toLowerCase());
      });
    }) as OrderDeliveryStatus) || OrderDeliveryStatus.Unspecified
  );
};
