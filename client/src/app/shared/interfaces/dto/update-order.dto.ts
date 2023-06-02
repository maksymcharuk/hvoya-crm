import { AbstractControl, FormGroup } from '@angular/forms';

import { OrderDeliveryStatus } from '@shared/enums/order-delivery-status.enum';
import { OrderStatus } from '@shared/enums/order-status.enum';

import { OrderCreateDTO } from './create-order.dto';

export interface OrderUpdateDTO extends Partial<OrderCreateDTO> {
  orderStatus?: OrderStatus;
  orderStatusComment?: string;
  deliveryStatus?: OrderDeliveryStatus;
}

export interface OrderUpdateFormGroup extends FormGroup {
  value: OrderUpdateDTO;

  controls: {
    email?: AbstractControl;
    firstName?: AbstractControl;
    lastName?: AbstractControl;
    middleName?: AbstractControl;
    phoneNumber?: AbstractControl;
    trackingId?: AbstractControl;
    deliveryType?: AbstractControl;
    city?: AbstractControl;
    postOffice?: AbstractControl;
    waybill?: AbstractControl;
    orderStatus?: AbstractControl;
    orderStatusComment?: AbstractControl;
    deliveryStatus?: AbstractControl;
  };
}
