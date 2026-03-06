import { DeliveryStatus } from '@enums/delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const UkrPoshtaStatusMap: { [key in DeliveryStatus]: string[] } = {
  [DeliveryStatus.Pending]: ['створено онлайн', 'очікує приймання'],
  [DeliveryStatus.Accepted]: [
    'прийнято',
    'прийняте',
    'надходження',
    'у сортувальному центрі',
  ],
  [DeliveryStatus.InTransit]: [
    'виїхало',
    'відправлення посилки',
    'слідує',
    'прямує до точки видачі',
    'з сортувального центру',
  ],
  [DeliveryStatus.Arrived]: [
    'прибуло до відділення',
    'прибуло до логістичного центру',
    'у відділенні',
    'у точці видачі',
  ],
  [DeliveryStatus.Received]: ['вручено одержувачу', 'вручено'],
  [DeliveryStatus.Declined]: ['відмовлено від посилки', 'скасовано замовлення'],
  [DeliveryStatus.Returned]: ['повернення відправнику', 'поверн'],
  [DeliveryStatus.Unspecified]: [],
};

export const getStatus: GetStatusFn = (status: string): DeliveryStatus => {
  // If status string contains any tag in UkrPoshtaStatusMap, return the key else return Unspecified
  return (
    (Object.keys(UkrPoshtaStatusMap).find((key: DeliveryStatus) => {
      return UkrPoshtaStatusMap[key].some((tag) => {
        return status.toLowerCase().includes(tag.toLowerCase());
      });
    }) as DeliveryStatus) || DeliveryStatus.Unspecified
  );
};
