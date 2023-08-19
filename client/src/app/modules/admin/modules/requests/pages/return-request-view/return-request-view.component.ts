import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject } from 'rxjs';

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { OrderReturnRequestItemEntity } from '@shared/interfaces/entities/order-return-request.entity';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { RequestItemUIEntity } from '@shared/interfaces/ui-entities/request-item.ui-entity';
import { RequestsService } from '@shared/services/requests.service';

@Component({
  selector: 'app-return-request-view',
  templateUrl: './return-request-view.component.html',
  styleUrls: ['./return-request-view.component.scss'],
})
export class ReturnRequestViewComponent implements OnInit {
  requestNumber = this.route.snapshot.params['number'];
  request$ = new BehaviorSubject<RequestEntity | null>(null);
  total$ = new BehaviorSubject<number>(0);
  showWaybillViewDialog = false;
  requestedItems: OrderReturnRequestItemEntity[] = [];

  returnRequestForm = this.formBuilder.group({
    approvedItems: this.formBuilder.array<RequestItemUIEntity>([]),
    managerComment: '',
    deduction: 0,
  });

  get managerComment(): AbstractControl {
    return this.returnRequestForm.get('managerComment')!;
  }

  get deduction(): AbstractControl {
    return this.returnRequestForm.get('deduction')!;
  }

  get approvedItems(): FormArray<FormControl> {
    return this.returnRequestForm.get(
      'approvedItems',
    ) as FormArray<FormControl>;
  }

  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestsService: RequestsService,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
  ) {
    this.requestsService
      .getRequest(this.requestNumber)
      .subscribe((request: RequestEntity) => {
        this.request$.next(request);
        this.total$.next(request.returnRequest!.total);
        this.requestedItems = request.returnRequest!.requestedItems;
        request.returnRequest!.requestedItems!.forEach((item) => {
          this.approvedItems.push(
            this.formBuilder.control(new RequestItemUIEntity(item)),
          );
        });
      });
  }

  ngOnInit(): void {
    this.returnRequestForm.valueChanges.subscribe((value) => {
      console.log(value);

      const approvedItemsTotal = value.approvedItems!.reduce(
        (acc, item) =>
          acc + item!.quantity * item!.orderItem.productProperties.price,
        0,
      );
      console.log(approvedItemsTotal);
      console.log(value.deduction!);

      this.total$.next(approvedItemsTotal - value.deduction!);
    });
  }

  showWaybillViewDialogHandler() {
    this.showWaybillViewDialog = true;
  }

  approveReturnRequest() {
    this.managerComment.clearValidators();
    this.managerComment.updateValueAndValidity();

    const requestedItemsQuantity = this.requestedItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    const approvedItemsQuantity = this.approvedItems.value.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    if (
      this.returnRequestForm.value.deduction! > 0 ||
      requestedItemsQuantity > approvedItemsQuantity
    ) {
      this.managerComment.setValidators([Validators.required]);
      this.managerComment.updateValueAndValidity();
    }

    if (this.returnRequestForm.invalid) {
      this.returnRequestForm.markAllAsTouched();
      return;
    }

    this.requestsService
      .approveRequest(
        {
          approvedItems: this.returnRequestForm.value
            .approvedItems as RequestItemUIEntity[],
          managerComment: this.returnRequestForm.value.managerComment!,
          deduction: this.returnRequestForm.value.deduction!,
        },
        this.requestNumber,
      )
      .subscribe((request) => {
        this.request$.next(request);
        this.messageService.add({
          severity: 'success',
          summary: 'Запит підтверджено',
          detail: 'Запит успішно підтверджено',
        });
      });
  }

  rejectReturnRequest() {
    this.managerComment.setValidators([Validators.required]);
    this.managerComment.updateValueAndValidity();

    if (this.returnRequestForm.invalid) {
      this.returnRequestForm.markAllAsTouched();
      return;
    }

    this.requestsService
      .rejectRequest(
        {
          managerComment: this.returnRequestForm.value.managerComment!,
        },
        this.requestNumber,
      )
      .subscribe((request) => {
        this.request$.next(request);
        this.messageService.add({
          severity: 'success',
          summary: 'Запит відхилено',
          detail: 'Запит успішно відхилено',
        });
      });
  }
}
