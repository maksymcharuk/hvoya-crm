import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordDTO, ConfirmPasswordDTOFormGroup } from '@shared/interfaces/confirm-password.dto';
import { AuthService } from '@shared/services/auth.service';
import { PasswordValidators } from '@shared/validators/password-validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  hasLowerCase: boolean | undefined = true;
  hasUpperCase: boolean | undefined = true;
  hasNumeric: boolean | undefined = true;
  hasMinLength: boolean | undefined = true;
  token: string | null = null;

  confirmPasswordForm = this.formBuilder.group(
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
  ) { }

  ngOnInit(): void {
    this.confirmPasswordForm.valueChanges.subscribe(() => {
      this.getPasswordErrors();
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        this.router.navigateByUrl('auth/sign-in');
      }
    });
  }

  onSubmit(value: ConfirmPasswordDTO) {
    this.authService.resetPassword(value.password, this.token).subscribe(() => {
      this.router.navigateByUrl('auth/sign-in');
    });
  }

  getPasswordErrors() {
    if (this.confirmPasswordForm.get('password')?.value) {
      this.hasLowerCase = this.confirmPasswordForm
        .get('password')
        ?.hasError('hasLowerCase');
      this.hasUpperCase = this.confirmPasswordForm
        .get('password')
        ?.hasError('hasUpperCase');
      this.hasNumeric = this.confirmPasswordForm.get('password')?.hasError('hasNumeric');
      this.hasMinLength = this.confirmPasswordForm
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
