import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphanumeric(options?: { allowSpaces?: boolean }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-zA-Z0-9]*$/;
    if (options?.allowSpaces) {
      regex = /^[a-zA-Z0-9 ]*$/;
    }
    const valid = regex.test(control.value);
    return valid ? null : { alphanumeric: true };
  };
}
