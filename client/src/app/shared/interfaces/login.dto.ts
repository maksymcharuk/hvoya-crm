import { AbstractControl, FormGroup } from "@angular/forms";

export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginDTOFormGroup extends FormGroup {
    value: LoginDTO;

    controls: {
        email: AbstractControl;
        password: AbstractControl;
    };
}