import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidators {
    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const valid = regex.test(control.value);
            return valid ? null : error;
        };
    }

    static MatchValidator(control: AbstractControl): ValidationErrors | null {
        const password: string = control.get("password")?.value;
        const confirmPassword: string = control.get("confirmPassword")?.value;

        if (!confirmPassword?.length) {
            return null;
        }


        if (confirmPassword.length >= 8) {
            if (password !== confirmPassword) {
                control.get("confirmPassword")?.setErrors({ mismatch: true });
            } else {
                return null;
            }
        } else {
            control.get("confirmPassword")?.setErrors({ mismatch: true });
        }
        return null;
    }
}
