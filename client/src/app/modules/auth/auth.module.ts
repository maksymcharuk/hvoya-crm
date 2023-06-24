import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordConfirmationComponent } from './forgot-password-confirmation/forgot-password-confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FreezedComponent } from './freezed/freezed.component';
import { ResetPasswordConfirmationComponent } from './reset-password-confirmation/reset-password-confirmation.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpConfirmationComponent } from './sign-up-confirmation/sign-up-confirmation.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AdminSignUpComponent } from './admin-sign-up/admin-sign-up.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SignUpConfirmationComponent,
    ConfirmEmailComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ForgotPasswordConfirmationComponent,
    FreezedComponent,
    ResetPasswordConfirmationComponent,
    AdminSignUpComponent,
  ],
  imports: [
    HttpClientModule,
    AuthRoutingModule,
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    InputMaskModule,
    InputTextareaModule,
    SharedModule,
    ProgressBarModule,
    TooltipModule,
  ],
  exports: [RouterModule],
})
export class AuthModule {}
