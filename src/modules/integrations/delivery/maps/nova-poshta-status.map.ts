import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { GetStatusFn } from '@interfaces/delivery';

export const NovaPoshtaStatusMap: { [key in OrderDeliveryStatus]: string[] } = {
  [OrderDeliveryStatus.Accepted]: ['прийнято', 'передано'],
  [OrderDeliveryStatus.InTransit]: ['відправлено', 'прямує'],
  [OrderDeliveryStatus.Arrived]: ['прибув', 'прибуло', 'у відділенні'],
  [OrderDeliveryStatus.Received]: ['отримано'],
  [OrderDeliveryStatus.Returned]: ['повернуто'],
  [OrderDeliveryStatus.Declined]: ['відмовлено'],
  [OrderDeliveryStatus.Unspecified]: [],
  [OrderDeliveryStatus.Pending]: [],
};

export const getStatus: GetStatusFn = (status: string): OrderDeliveryStatus => {
  // If status string contains any tag in NovaPoshtaStatusMap, return the key else return Unspecified
  return (
    (Object.keys(NovaPoshtaStatusMap).find((key: OrderDeliveryStatus) => {
      return NovaPoshtaStatusMap[key].some((tag) => {
        return status.toLowerCase().includes(tag.toLowerCase());
      });
    }) as OrderDeliveryStatus) || OrderDeliveryStatus.Unspecified
  );
};
