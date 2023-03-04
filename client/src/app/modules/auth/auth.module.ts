import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SharedModule } from '@shared/shared.module';
import { FreezedComponent } from './freezed/freezed.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ConfirmEmailComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    FreezedComponent,
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
    DialogModule,
    InputMaskModule,
    InputTextareaModule,
    SharedModule,
  ],
  exports: [RouterModule],
})
export class AuthModule { }
