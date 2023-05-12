import { AbstractControl, FormGroup } from '@angular/forms';

export interface SignUpDTO {
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  website: string;
  bio: string;
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
    location: AbstractControl;
    website: AbstractControl;
    bio: AbstractControl;
  };
}
