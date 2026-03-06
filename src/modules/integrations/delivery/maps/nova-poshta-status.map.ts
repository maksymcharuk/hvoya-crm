import { DeliveryStatus } from '@enums/delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const NovaPoshtaStatusMap: { [key in DeliveryStatus]: string[] } = {
  [DeliveryStatus.Pending]: [
    'оформив посилку',
    'але ще не відправив',
    'накладну',
  ],
  [DeliveryStatus.Accepted]: ['прийнята', 'прийнято', 'передано'],
  [DeliveryStatus.InTransit]: [
    'виїхала',
    'відправлено',
    'прямує',
    'відправлення у',
    "видано кур'єру",
  ],
  [DeliveryStatus.Arrived]: [
    'прибула',
    'прибув',
    'прибуло',
    'у відділенні',
    'у відділення',
  ],
  [DeliveryStatus.Received]: ['отримано', 'видана'],
  [DeliveryStatus.Declined]: ['відмовився', 'відмовлено', 'відмова'],
  [DeliveryStatus.Returned]: [
    'заявку на повернення',
    'повернуто відправнику',
    'повернення відправнику',
  ],
  [DeliveryStatus.Unspecified]: [],
};

export const getStatus: GetStatusFn = (status: string): DeliveryStatus => {
  // If status string contains any tag in NovaPoshtaStatusMap, return the key else return Unspecified
  return (
    (Object.keys(NovaPoshtaStatusMap).find((key: DeliveryStatus) => {
      return NovaPoshtaStatusMap[key].some((tag) => {
        return status.toLowerCase().includes(tag.toLowerCase());
      });
    }) as DeliveryStatus) || DeliveryStatus.Unspecified
  );
};
