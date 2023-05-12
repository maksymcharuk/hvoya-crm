import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateUserProfileDTO {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  location: string;
  website: string;
  bio: string;
}

export interface UpdateUserProfileFormGroup extends FormGroup {
  value: UpdateUserProfileDTO;

  controls: {
    phoneNumber: AbstractControl;
    firstName: AbstractControl;
    lastName: AbstractControl;
    middleName: AbstractControl;
    location: AbstractControl;
    website: AbstractControl;
    bio: AbstractControl;
  };
}
