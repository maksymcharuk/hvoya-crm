import { DeliveryStatus } from '@enums/delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const MeestPoshtaStatusMap: { [key in DeliveryStatus]: string[] } = {
  [DeliveryStatus.Accepted]: [],
  [DeliveryStatus.InTransit]: [
    'надходження',
    'відправка',
    'транзит',
    'прибуло',
    "видано кур'єру",
  ],
  [DeliveryStatus.Arrived]: ['надійшло'],
  [DeliveryStatus.Received]: ['доручено'],
  [DeliveryStatus.Returned]: ['повернуто', 'повернуте'],
  [DeliveryStatus.Declined]: ['відмова'],
  [DeliveryStatus.Unspecified]: [],
  [DeliveryStatus.Pending]: ['оформлено'],
};

export const getStatus: GetStatusFn = (status: string): DeliveryStatus => {
  // If status string contains any tag in MeestPoshtaStatusMap, return the key else return Unspecified
  return (
    (Object.keys(MeestPoshtaStatusMap).find((key: DeliveryStatus) => {
      return MeestPoshtaStatusMap[key].some((tag) => {
        return status.toLowerCase().includes(tag.toLowerCase());
      });
    }) as DeliveryStatus) || DeliveryStatus.Unspecified
  );
};
