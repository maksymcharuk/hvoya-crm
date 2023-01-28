import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateUserProfileDTO {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  location: string;
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
    location: AbstractControl;
    bio: AbstractControl;
    cardNumber: AbstractControl;
    cardholderName: AbstractControl;
  };
}
