import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateWaybillDTO {
  trackingId?: string;
  deliveryService?: string;
  waybill?: File;
}

export interface UpdateWaybillFormGroup extends FormGroup {
  value: UpdateWaybillDTO;

  controls: {
    trackingId: AbstractControl;
    deliveryService: AbstractControl;
    waybill: AbstractControl;
  };
}
