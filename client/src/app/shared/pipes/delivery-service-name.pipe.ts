import { Pipe, PipeTransform } from '@angular/core';

import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { getDeliveryServiceName } from '@shared/maps/delivery-service.map';

@Pipe({ name: 'deliveryServiceName' })
export class DeliveryServiceNamePipe implements PipeTransform {
  transform(value: DeliveryService | undefined): string {
    return getDeliveryServiceName(value);
  }
}
