import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import {
  SignUpDTO,
  SignUpDTOFormGroup,
} from '@shared/interfaces/dto/sign-up.dto';
import { AuthService } from '@shared/services/auth.service';
import { PasswordValidators } from '@shared/validators/password-validator';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  hasLowerCase: boolean | undefined = true;
  hasUpperCase: boolean | undefined = true;
  hasNumeric: boolean | undefined = true;
  hasMinLength: boolean | undefined = true;
  displayConfirmEmailModal: boolean = false;
  confirmEmailValue: string = '';
  isLoading: boolean = false;

  signUpForm = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          PasswordValidators.patternValidator(/\d/, { hasNumeric: true }),
          PasswordValidators.patternValidator(/[A-Z]/, { hasUpperCase: true }),
          PasswordValidators.patternValidator(/[a-z]/, { hasLowerCase: true }),
        ],
      ],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      bio: ['', Validators.required],
    },
    {
      validator: PasswordValidators.MatchValidator,
    } as AbstractControlOptions,
  ) as SignUpDTOFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.signUpForm.valueChanges.subscribe(() => {
      this.getPasswordErrors();
    });
  }

  onSubmit(value: SignUpDTO) {
    if (!this.signUpForm.valid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.signUp(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.displayConfirmEmailModal = true;
        this.confirmEmailValue = this.signUpForm.get('email')?.value;
        this.signUpForm.reset();
      });
  }

  getPasswordErrors() {
    if (this.signUpForm.get('password')?.value) {
      this.hasLowerCase = this.signUpForm
        .get('password')
        ?.hasError('hasLowerCase');
      this.hasUpperCase = this.signUpForm
        .get('password')
        ?.hasError('hasUpperCase');
      this.hasNumeric = this.signUpForm.get('password')?.hasError('hasNumeric');
      this.hasMinLength = this.signUpForm
        .get('password')
        ?.hasError('minlength');
    } else {
      this.hasLowerCase = true;
      this.hasUpperCase = true;
      this.hasNumeric = true;
      this.hasMinLength = true;
    }
  }
}
