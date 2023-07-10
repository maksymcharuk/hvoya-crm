import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { SharedModule } from '@shared/shared.module';
import { AbilityModule } from '@casl/angular';

import { RequestsRoutingModule } from './requests-routing.module';
import { RequestListComponent } from './pages/request-list/request-list.component';

@NgModule({
  declarations: [RequestListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    AbilityModule,
    RequestsRoutingModule,
  ]
})
export class RequestsModule { }
