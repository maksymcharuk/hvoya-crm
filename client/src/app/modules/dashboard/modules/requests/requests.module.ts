import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SkeletonModule } from 'primeng/skeleton';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbilityModule } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { ReturnRequestCreateComponent } from './components/return-request-create/return-request-create.component';
import { RequestCreateComponent } from './pages/request-create/request-create.component';
import { RequestListComponent } from './pages/request-list/request-list.component';
import { ReturnRequestViewComponent } from './pages/return-request-view/return-request-view.component';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
  declarations: [
    RequestListComponent,
    RequestCreateComponent,
    ReturnRequestCreateComponent,
    ReturnRequestViewComponent,
  ],
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
  ],
})
export class RequestsModule {}
