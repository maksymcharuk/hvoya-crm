import { AbstractControl, FormGroup } from '@angular/forms';

export interface OrderCreateDTO {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  trackingId?: string;
  deliveryType: string;
  city: string;
  postOffice: string;
  waybill?: File;
}

export interface OrderCreateFormGroup extends FormGroup {
  value: OrderCreateDTO;

  controls: {
    email: AbstractControl;
    firstName: AbstractControl;
    lastName: AbstractControl;
    middleName: AbstractControl;
    phoneNumber: AbstractControl;
    trackingId: AbstractControl;
    deliveryType: AbstractControl;
    city: AbstractControl;
    postOffice: AbstractControl;
    waybill: AbstractControl;
  };
}
