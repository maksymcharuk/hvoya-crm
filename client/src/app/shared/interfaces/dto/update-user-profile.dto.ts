import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateUserProfileDTO {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  storeName: string;
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
    storeName: AbstractControl;
    website: AbstractControl;
    bio: AbstractControl;
  };
}
