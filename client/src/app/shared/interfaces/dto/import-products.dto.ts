import { AbstractControl, FormGroup } from '@angular/forms';

export interface ImportProductsDTO {
  source: string;
  link?: string;
  file?: File;
}

export interface ImportProductsFormGroup extends FormGroup {
  value: ImportProductsDTO;

  controls: {
    source: AbstractControl;
    link: AbstractControl;
    file: AbstractControl;
  };
}
