import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateUserProfileDTO {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  city: string;
  bio: string;
  cardNumber: string;
  cardholderName: string;
}

export interface UpdateUserProfileFormGroup extends FormGroup {
  value: UpdateUserProfileDTO;

  controls: {
    phoneNumber: AbstractControl;
    firstName: AbstractControl;
    lastName: AbstractControl;
    city: AbstractControl;
    bio: AbstractControl;
    cardNumber: AbstractControl;
    cardholderName: AbstractControl;
  };
}
