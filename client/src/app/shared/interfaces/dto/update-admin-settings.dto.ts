import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateAdminSettingsDTO {
  previousPassword: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateAdminSettingsFormGroup extends FormGroup {
  value: UpdateAdminSettingsDTO;

  controls: {
    previousPassword: AbstractControl;
    password: AbstractControl;
    confirmPassword: AbstractControl;
  };
}
