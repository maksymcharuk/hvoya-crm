import { DeliveryStatus } from '@enums/delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const UkrPoshtaStatusMap: { [key in DeliveryStatus]: string[] } = {
  [DeliveryStatus.Accepted]: [
    'надходження',
    'прийняте',
    'прийнято',
    'у сортувальному центрі',
  ],
  [DeliveryStatus.InTransit]: [
    'до відділення',
    'відправлення посилки',
    'слідує',
    'прямує до точки видачі',
    'з сортувального центру',
  ],
  [DeliveryStatus.Arrived]: ['у відділенні', 'прибуло', 'у точці видачі'],
  [DeliveryStatus.Received]: ['вручено'],
  [DeliveryStatus.Returned]: ['поверн'],
  [DeliveryStatus.Declined]: ['відмовлено', 'скасовано', 'відмова'],
  [DeliveryStatus.Unspecified]: [],
  [DeliveryStatus.Pending]: ['створено онлайн'],
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
