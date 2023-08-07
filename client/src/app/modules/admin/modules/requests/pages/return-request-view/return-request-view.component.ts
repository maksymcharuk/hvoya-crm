import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestEntity } from '@shared/interfaces/entities/request.entity'
import { RequestsService } from '@shared/services/requests.service';

import { FileUpload } from 'primeng/fileupload';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-return-request-view',
  templateUrl: './return-request-view.component.html',
  styleUrls: ['./return-request-view.component.scss']
})
export class ReturnRequestViewComponent {

  requestNumber = this.route.snapshot.params['number'];
  request$ = new BehaviorSubject<RequestEntity | null>(null);
  showWaybillViewDialog = false;

  returnRequestForm = this.formBuilder.group({
    requestedItems: this.formBuilder.array([]),
  });

  get requestedItems() {
    return this.returnRequestForm.controls["requestedItems"] as FormArray<FormControl>;
  }

  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  constructor(
    private readonly route: ActivatedRoute,
    private requestsService: RequestsService,
    private formBuilder: FormBuilder,
  ) {
    this.requestsService.getRequest(this.requestNumber).subscribe((request: RequestEntity) => {
      this.request$.next(request);
      request.returnRequest!.requestedItems!.forEach((item) => {
        this.requestedItems.push(this.formBuilder.control(item));
      });
    })
  }

  showWaybillViewDialogHandler() {
    this.showWaybillViewDialog = true;
  }
}
