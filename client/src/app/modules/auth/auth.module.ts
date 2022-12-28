import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from '../../auth/sign-in/sign-in.component';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
];

@NgModule({
  declarations: [SignInComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule, InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule
  ],
  exports: [RouterModule],
})
export class AuthModule { }
