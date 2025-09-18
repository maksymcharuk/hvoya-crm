import { DeliveryService } from '@shared/enums/delivery-service.enum';

const deliveryServiceMap = new Map<DeliveryService, string>([
  [DeliveryService.SelfPickup, 'Самовивіз'],
  [DeliveryService.NovaPoshta, 'Нова пошта'],
  [DeliveryService.UkrPoshta, 'Укрпошта'],
  [DeliveryService.MeestPoshta, 'Meest'],
]);

export const getDeliveryServiceName = (
  deliveryService: DeliveryService | undefined,
) => {
  return (
    (deliveryService && deliveryServiceMap.get(deliveryService)) ||
    'Не визначено'
  );
};
