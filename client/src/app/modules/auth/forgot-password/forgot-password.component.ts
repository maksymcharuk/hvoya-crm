import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import {
  ForgotPasswordDTO,
  ForgotPasswordFormGroupDTO,
} from '@shared/interfaces/dto/forgot-password.dto';
import { AuthService } from '@shared/services/auth.service';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  displayConfirmDialog = false;
  userEmail = '';
  isLoading: boolean = false;

  forgotPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  }) as ForgotPasswordFormGroupDTO;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  onSubmit(value: ForgotPasswordDTO) {
    if (!this.forgotPasswordForm.valid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.displayConfirmDialog = true;
        this.userEmail = this.forgotPasswordForm.get('email')?.value;
      });
  }
}
