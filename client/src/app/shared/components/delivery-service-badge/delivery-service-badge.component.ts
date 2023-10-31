import { Component, Input } from '@angular/core';

import { DeliveryService } from '@shared/enums/delivery-service.enum';

@Component({
  selector: 'app-delivery-service-badge',
  templateUrl: './delivery-service-badge.component.html',
  styleUrls: ['./delivery-service-badge.component.scss'],
})
export class DeliveryServiceBadgeComponent {
  @Input() deliveryService!: DeliveryService;
  @Input() mode: 'full' | 'short' = 'full';
  @Input() withText = false;

  deliveryServiceLogoMapping = {
    [DeliveryService.SelfPickup]: {
      full: 'assets/images/delivery-services/self-pickup-full-logo.png',
      short: 'assets/images/delivery-services/self-pickup-short-logo.png',
    },
    [DeliveryService.NovaPoshta]: {
      full: 'assets/images/delivery-services/nova-poshta-full-logo.png',
      short: 'assets/images/delivery-services/nova-poshta-short-logo.png',
    },
    [DeliveryService.UkrPoshta]: {
      full: 'assets/images/delivery-services/ukr-poshta-full-logo.png',
      short: 'assets/images/delivery-services/ukr-poshta-short-logo.png',
    },
  };

  get deliveryServiceLogo(): string {
    return (
      this.deliveryServiceLogoMapping?.[this.deliveryService]?.[this.mode] || ''
    );
  }
}
