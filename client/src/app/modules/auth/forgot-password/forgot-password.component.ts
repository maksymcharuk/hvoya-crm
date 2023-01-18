import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ForgotPasswordDTO,
  ForgotPasswordFormGroupDTO,
} from '@shared/interfaces/dto/forgot-password.dto';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  displayConfirmDialog = false;
  userEmail = '';

  forgotPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  }) as ForgotPasswordFormGroupDTO;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  onSubmit(value: ForgotPasswordDTO) {
    this.authService.forgotPassword(value).subscribe(() => {
      this.displayConfirmDialog = true;
      this.userEmail = this.forgotPasswordForm.get('email')?.value;
    });
  }
}
