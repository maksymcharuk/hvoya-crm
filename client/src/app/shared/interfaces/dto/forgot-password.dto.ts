import { AbstractControl, FormGroup } from '@angular/forms';

export interface ForgotPasswordDTO {
  email: string;
}

export interface ForgotPasswordFormGroupDTO extends FormGroup {
  value: ForgotPasswordDTO;

  controls: {
    email: AbstractControl;
  };
}
