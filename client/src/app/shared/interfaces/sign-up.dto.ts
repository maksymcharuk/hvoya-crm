import { FormGroup, AbstractControl } from "@angular/forms";

export interface SignUpDTO {
    email: string;
    password: string;
}


export interface SignUpDTOFormGroup extends FormGroup {
    value: SignUpDTO;

    controls: {
        email: AbstractControl;
        password: AbstractControl;
    };
}