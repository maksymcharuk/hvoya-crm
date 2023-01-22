import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

import { SharedModule } from '@shared/shared.module';

import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';

import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [AccountComponent, ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    InputMaskModule,
    AccountRoutingModule,
  ],
})
export class AccountModule {}
