import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cyrillic(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[А-Яа-яІіЇїЄєҐґ]*$/;
    const valid = regex.test(control.value);
    return valid ? null : { cyrillic: true };
  };
}
