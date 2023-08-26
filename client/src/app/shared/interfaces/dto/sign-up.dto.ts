import { AbstractControl, FormGroup } from '@angular/forms';

export interface SignUpDTO {
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  website: string;
}

export interface SignUpDTOFormGroup extends FormGroup {
  value: SignUpDTO;

  controls: {
    email: AbstractControl;
    password: AbstractControl;
    firstName: AbstractControl;
    middleName: AbstractControl;
    lastName: AbstractControl;
    phoneNumber: AbstractControl;
    website: AbstractControl;
  };
}
