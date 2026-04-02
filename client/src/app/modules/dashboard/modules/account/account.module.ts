import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';

@NgModule({
  declarations: [AccountComponent, ProfileComponent, SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    InputMaskModule,
    PasswordModule,
    DividerModule,
    AccountRoutingModule,
    TooltipModule,
  ],
})
export class AccountModule {}
