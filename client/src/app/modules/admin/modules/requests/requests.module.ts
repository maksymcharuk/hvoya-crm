import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SkeletonModule } from 'primeng/skeleton';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbilityModule } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { RequestListComponent } from './pages/request-list/request-list.component';
import { ReturnRequestViewComponent } from './pages/return-request-view/return-request-view.component';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
  declarations: [RequestListComponent, ReturnRequestViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RequestsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    SkeletonModule,
    AbilityModule,
    InputTextareaModule,
  ],
})
export class RequestsModule {}
