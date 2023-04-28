import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordConfirmationComponent } from './forgot-password-confirmation/forgot-password-confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FreezedComponent } from './freezed/freezed.component';
import { ResetPasswordConfirmationComponent } from './reset-password-confirmation/reset-password-confirmation.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpConfirmationComponent } from './sign-up-confirmation/sign-up-confirmation.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'sign-up',
    children: [
      { path: '', component: SignUpComponent },
      { path: 'confirmation', component: SignUpConfirmationComponent },
    ],
  },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  {
    path: 'reset-password',
    children: [
      { path: '', component: ResetPasswordComponent },
      { path: 'confirmation', component: ResetPasswordConfirmationComponent },
    ],
  },
  {
    path: 'forgot-password',
    children: [
      { path: '', component: ForgotPasswordComponent },
      { path: 'confirmation', component: ForgotPasswordConfirmationComponent },
    ],
  },
  { path: 'freezed', component: FreezedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
