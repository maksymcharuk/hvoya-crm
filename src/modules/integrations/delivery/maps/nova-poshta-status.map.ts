import { DeliveryStatus } from '@enums/delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const NovaPoshtaStatusMap: { [key in DeliveryStatus]: string[] } = {
  [DeliveryStatus.Accepted]: ['прийнято', 'передано'],
  [DeliveryStatus.InTransit]: [
    'відправлено',
    'прямує',
    'відправлення у',
    "видано кур'єру",
  ],
  [DeliveryStatus.Arrived]: ['прибув', 'прибуло', 'у відділенні'],
  [DeliveryStatus.Received]: ['отримано', 'видана'],
  [DeliveryStatus.Returned]: ['повернуто', 'повернення'],
  [DeliveryStatus.Declined]: ['відмовлено', 'відмова', 'відмовився'],
  [DeliveryStatus.Unspecified]: [],
  [DeliveryStatus.Pending]: ['накладну'],
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
