import { FormGroup, AbstractControl } from '@angular/forms';

export interface ConfirmPasswordDTO {
  password: string;
  confirmPassword: string;
}

export interface ConfirmPasswordDTOFormGroup extends FormGroup {
  value: ConfirmPasswordDTO;

  controls: {
    password: AbstractControl;
    confirmPassword: AbstractControl;
  };
}
