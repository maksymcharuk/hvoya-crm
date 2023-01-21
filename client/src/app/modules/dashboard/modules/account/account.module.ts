import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, SharedModule, AccountRoutingModule],
})
export class AccountModule {}
