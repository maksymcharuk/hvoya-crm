import { AbstractControl, FormGroup } from '@angular/forms';

export interface OrderCreateDTO {
  // NOTE: Keep this for a waybill generation logic in future
  // email: string;
  // firstName: string;
  // lastName: string;
  // middleName: string;
  // phoneNumber: string;
  trackingId: string;
  // NOTE: Keep this for a waybill generation logic in future
  // deliveryType: string;
  // city: string;
  // postOffice: string;
  waybill?: File;
}

export interface OrderCreateFormGroup extends FormGroup {
  value: OrderCreateDTO;

  controls: {
    // NOTE: Keep this for a waybill generation logic in future
    // email: AbstractControl;
    // firstName: AbstractControl;
    // lastName: AbstractControl;
    // middleName: AbstractControl;
    // phoneNumber: AbstractControl;
    trackingId: AbstractControl;
    // NOTE: Keep this for a waybill generation logic in future
    // deliveryType: AbstractControl;
    // city: AbstractControl;
    // postOffice: AbstractControl;
    waybill: AbstractControl;
  };
}
