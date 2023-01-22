import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateAdminProfileDTO {
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface UpdateAdminProfileFormGroup extends FormGroup {
  value: UpdateAdminProfileDTO;

  controls: {
    phoneNumber: AbstractControl;
    firstName: AbstractControl;
    lastName: AbstractControl;
  };
}
