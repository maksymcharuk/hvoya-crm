import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { RequestListComponent } from './pages/request-list/request-list.component';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
  declarations: [
    RequestListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RequestsRoutingModule,
  ]
})
export class RequestsModule { }
