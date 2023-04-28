import { finalize } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ConfirmPasswordDTO,
  ConfirmPasswordDTOFormGroup,
} from '@shared/interfaces/dto/confirm-password.dto';
import { AuthService } from '@shared/services/auth.service';
import { PasswordValidators } from '@shared/validators/password-validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  hasLowerCase: boolean | undefined = true;
  hasUpperCase: boolean | undefined = true;
  hasNumeric: boolean | undefined = true;
  hasMinLength: boolean | undefined = true;
  token: string | null = null;
  isLoading: boolean = false;

  resetPasswordForm = this.formBuilder.group(
    {
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
  ) as ConfirmPasswordDTOFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.getPasswordErrors();
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        this.router.navigate(['/auth/sign-in']);
      }
    });
  }

  onSubmit(value: ConfirmPasswordDTO) {
    this.isLoading = true;
    this.authService
      .resetPassword(value.password, this.token)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.router.navigate(['/auth/reset-password/confirmation']);
      });
  }

  getPasswordErrors() {
    if (this.resetPasswordForm.get('password')?.value) {
      this.hasLowerCase = this.resetPasswordForm
        .get('password')
        ?.hasError('hasLowerCase');
      this.hasUpperCase = this.resetPasswordForm
        .get('password')
        ?.hasError('hasUpperCase');
      this.hasNumeric = this.resetPasswordForm
        .get('password')
        ?.hasError('hasNumeric');
      this.hasMinLength = this.resetPasswordForm
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
