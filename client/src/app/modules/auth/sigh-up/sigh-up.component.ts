import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { SignUpDTO, SignUpDTOFormGroup } from '@shared/interfaces/sign-up.dto';
import { PasswordValidators } from '@shared/validators/password-validator';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-sigh-up',
  templateUrl: './sigh-up.component.html',
  styleUrls: ['./sigh-up.component.scss'],
})
export class SighUpComponent implements OnInit {
  hasLowerCase: boolean | undefined = true;
  hasUpperCase: boolean | undefined = true;
  hasNumeric: boolean | undefined = true;
  hasMinLength: boolean | undefined = true;
  displayConfirmEmailModal: boolean = false;
  confirmEmailValue: string = '';

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
    this.authService.signUp(value).subscribe(() => {
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
