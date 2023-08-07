import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { SharedModule } from '@shared/shared.module';

import { RequestListComponent } from './pages/request-list/request-list.component';
import { ReturnRequestViewComponent } from './pages/return-request-view/return-request-view.component';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
  declarations: [
    RequestListComponent,
    ReturnRequestViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RequestsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    DialogModule,
    ButtonModule,
  ]
})
export class RequestsModule { }
