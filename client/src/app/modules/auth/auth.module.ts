import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import { SignInComponent } from '../../auth/sign-in/sign-in.component';
import { SighUpComponent } from '../../auth/sigh-up/sigh-up.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SighUpComponent }
];

@NgModule({
  declarations: [SignInComponent, SighUpComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    DividerModule
  ],
  exports: [RouterModule],
})
export class AuthModule { }
