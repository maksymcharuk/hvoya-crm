import { AbstractControl, FormGroup } from '@angular/forms';

export interface UpdateUserByAdminDTO {
  note: string;
}

export interface UpdateUserByAdminFormGroup extends FormGroup {
  value: UpdateUserByAdminDTO;

  controls: {
    note: AbstractControl;
  };
}
