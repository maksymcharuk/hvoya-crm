import { AbstractControl, ValidationErrors } from '@angular/forms';

export function alphanumeric(
  control: AbstractControl,
): ValidationErrors | null {
  const regex = /^[a-zA-Z0-9]*$/;
  const valid = regex.test(control.value);
  return valid ? null : { alphanumeric: true };
}
