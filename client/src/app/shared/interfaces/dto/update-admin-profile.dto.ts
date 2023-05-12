import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateAdminProfileDTO {
  phoneNumber: string;
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface UpdateAdminProfileFormGroup extends FormGroup {
  value: UpdateAdminProfileDTO;

  controls: {
    phoneNumber: AbstractControl;
    lastName: AbstractControl;
    firstName: AbstractControl;
    middleName: AbstractControl;
  };
}
