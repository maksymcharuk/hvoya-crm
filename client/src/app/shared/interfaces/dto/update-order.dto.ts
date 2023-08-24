import { AbstractControl, FormGroup } from '@angular/forms';

import { DeliveryStatus } from '@shared/enums/delivery-status.enum';
import { OrderStatus } from '@shared/enums/order-status.enum';

import { OrderCreateDTO } from './create-order.dto';

export interface OrderUpdateDTO extends Partial<OrderCreateDTO> {
  orderStatus?: OrderStatus;
  orderStatusComment?: string;
  deliveryStatus?: DeliveryStatus;
  managerNote?: string;
  customerNote?: string;
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
    managerNote?: AbstractControl;
    customerNote?: AbstractControl;
  };
}
