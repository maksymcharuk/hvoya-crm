import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { NgxDocViewerModule } from 'ngx-doc-viewer';;

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';

import { SharedModule } from '@shared/shared.module';
import { AbilityModule } from '@casl/angular';

import { RequestsRoutingModule } from './requests-routing.module';
import { RequestListComponent } from './pages/request-list/request-list.component';
import { RequestCreateComponent } from './pages/request-create/request-create.component';
import { ReturnRequestViewComponent } from './pages/return-request-view/return-request-view.component';
import { ReturnRequestCreateComponent } from './components/return-request-create/return-request-create.component';
import { ReturnRequestOrderItemComponent } from './components/return-request-order-item/return-request-order-item.component';

@NgModule({
  declarations: [RequestListComponent, RequestCreateComponent, ReturnRequestCreateComponent, ReturnRequestOrderItemComponent, ReturnRequestViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    AbilityModule,
    RequestsRoutingModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    SkeletonModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    NgxDocViewerModule,
    DialogModule,
  ]
})
export class RequestsModule { }
