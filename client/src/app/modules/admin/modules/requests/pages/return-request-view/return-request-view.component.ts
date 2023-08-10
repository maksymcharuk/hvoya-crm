import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject } from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { RequestsService } from '@shared/services/requests.service';

@Component({
  selector: 'app-return-request-view',
  templateUrl: './return-request-view.component.html',
  styleUrls: ['./return-request-view.component.scss'],
})
export class ReturnRequestViewComponent {
  requestNumber = this.route.snapshot.params['number'];
  request$ = new BehaviorSubject<RequestEntity | null>(null);
  showWaybillViewDialog = false;

  returnRequestForm = this.formBuilder.group({
    approvedItems: this.formBuilder.array([]),
    deduction: this.formBuilder.control(0),
  });

  get approvedItems(): FormArray<FormControl> {
    return this.returnRequestForm.get(
      'approvedItems',
    ) as FormArray<FormControl>;
  }

  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  constructor(
    private readonly route: ActivatedRoute,
    private requestsService: RequestsService,
    private formBuilder: FormBuilder,
  ) {
    this.requestsService
      .getRequest(this.requestNumber)
      .subscribe((request: RequestEntity) => {
        this.request$.next(request);
        request.returnRequest!.requestedItems!.forEach((item) => {
          this.approvedItems.push(this.formBuilder.control(item));
        });
      });
  }

  showWaybillViewDialogHandler() {
    this.showWaybillViewDialog = true;
  }

  approveReturnRequest() {

    const formData = new FormData();

    formData.append('deduction', this.returnRequestForm.value.deduction!.toString());
    formData.append('approvedItems', JSON.stringify(this.returnRequestForm.value.approvedItems));

    this.requestsService.approveRequest(formData, this.requestNumber).subscribe((request) => {
      console.log(request);
    });
    console.log(this.returnRequestForm.value);
    console.log('approveReturnRequest');
  }

  rejectReturnRequest() {
    console.log('rejectReturnRequest');
  }
}
