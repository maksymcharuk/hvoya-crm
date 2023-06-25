import { AbstractControl, FormGroup } from '@angular/forms';

export interface AdminSignUpFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  password: string;
  phoneNumber: string;
}

export interface AdminSignUpDTO extends AdminSignUpFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  password: string;
  phoneNumber: string;
  token: string;
}

export interface AdminSignUpDTOFormGroup extends FormGroup {
  value: AdminSignUpFormData;

  controls: {
    firstName: AbstractControl;
    lastName: AbstractControl;
    middleName: AbstractControl;
    password: AbstractControl;
    phoneNumber: AbstractControl;
  };
}
