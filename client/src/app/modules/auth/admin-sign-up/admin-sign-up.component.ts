import { finalize } from 'rxjs';

import { Component } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminSignUpDTOFormGroup } from '@shared/interfaces/dto/admin-sign-up.dto';
import { JwtAdminInvitation } from '@shared/interfaces/jwt-admin-invitation.interface';
import { AuthService } from '@shared/services/auth.service';
import { TokenService } from '@shared/services/token.service';
import { PasswordValidators } from '@shared/validators/password-validator';

@Component({
  selector: 'app-admin-sign-up',
  templateUrl: './admin-sign-up.component.html',
  styleUrls: ['./admin-sign-up.component.scss'],
})
export class AdminSignUpComponent {
  hasLowerCase: boolean | undefined = true;
  hasUpperCase: boolean | undefined = true;
  hasNumeric: boolean | undefined = true;
  hasMinLength: boolean | undefined = true;
  isLoading: boolean = false;

  token: string | null = this.route.snapshot.queryParams['token'];
  decodedToken: JwtAdminInvitation | null = this.token
    ? (this.tokenService.decode(this.token) as JwtAdminInvitation)
    : null;

  adminSignUpForm = this.formBuilder.group(
    {
      email: [this.decodedToken?.email],
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
    },
    {
      validator: PasswordValidators.MatchValidator,
    } as AbstractControlOptions,
  ) as AdminSignUpDTOFormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.adminSignUpForm.valueChanges.subscribe(() => {
      this.getPasswordErrors();
    });
  }

  onSubmit() {
    if (!this.adminSignUpForm.valid) {
      this.adminSignUpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService
      .adminSignUp({
        ...this.adminSignUpForm.value,
        token: this.token!,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.router.navigate(['/admin']);
      });
  }

  getPasswordErrors() {
    if (this.adminSignUpForm.get('password')?.value) {
      this.hasLowerCase = this.adminSignUpForm
        .get('password')
        ?.hasError('hasLowerCase');
      this.hasUpperCase = this.adminSignUpForm
        .get('password')
        ?.hasError('hasUpperCase');
      this.hasNumeric = this.adminSignUpForm
        .get('password')
        ?.hasError('hasNumeric');
      this.hasMinLength = this.adminSignUpForm
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
