import { AbstractControl, FormGroup } from '@angular/forms';

export interface SignInDTO {
  email: string;
  password: string;
}

export interface SignInDTOFormGroup extends FormGroup {
  value: SignInDTO;

  controls: {
    email: AbstractControl;
    password: AbstractControl;
  };
}
