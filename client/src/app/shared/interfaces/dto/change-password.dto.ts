import { AbstractControl, FormGroup } from '@angular/forms';

export interface ChangePasswordDTO {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormGroup extends FormGroup {
  value: ChangePasswordDTO;

  controls: {
    currentPassword: AbstractControl;
    password: AbstractControl;
    confirmPassword: AbstractControl;
  };
}
