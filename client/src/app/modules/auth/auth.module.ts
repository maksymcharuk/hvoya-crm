import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider'
import { DialogModule } from 'primeng/dialog';;

import { SignInComponent } from './sign-in/sign-in.component';
import { SighUpComponent } from './sigh-up/sigh-up.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SighUpComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
];

@NgModule({
  declarations: [SignInComponent, SighUpComponent, ConfirmEmailComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    DialogModule,
  ],
  exports: [RouterModule],
})
export class AuthModule { }
