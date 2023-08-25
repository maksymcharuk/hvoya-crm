import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, finalize } from 'rxjs';

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { IMAGE_ACCEPTABLE_FILE_FORMATS } from '@shared/constants/order.constants';
import { OrderReturnRequestItemEntity } from '@shared/interfaces/entities/order-return-request.entity';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { RequestItemUIEntity } from '@shared/interfaces/ui-entities/request-item.ui-entity';
import { RequestsService } from '@shared/services/requests.service';

enum Action {
  Approve = 'approve',
  Reject = 'reject',
}

const CONFIRM_MESSAGE =
  'Ви справді хочете підтвердити цей запит на повернення?';
const REJECT_MESSAGE = 'Ви справді хочете відхилити цей запит на повернення?';

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
  submitting = false;
  imageFormats = IMAGE_ACCEPTABLE_FILE_FORMATS;
  confirmRejectHeader = '';
  acceptButtonStyleClass = '';
  action = Action;

  returnRequestForm = this.formBuilder.nonNullable.group(
    {
      approvedItems: this.formBuilder.array<RequestItemUIEntity>([]),
      managerComment: '',
      managerImages: this.formBuilder.nonNullable.array<File>([]),
      deduction: 0,
    },
    { validators: this.deductionMax },
  );

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

  get managerImagesControl(): FormArray<FormControl<File>> {
    return this.returnRequestForm.controls.managerImages;
  }

  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestsService: RequestsService,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdRef: ChangeDetectorRef,
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
      const approvedItemsTotal = value.approvedItems!.reduce(
        (acc, item) =>
          acc + item!.quantity * item!.orderItem.productProperties.price,
        0,
      );

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

    const formValue = this.returnRequestForm.value;
    const formData = new FormData();

    formData.append('approvedItems', JSON.stringify(formValue.approvedItems));
    formData.append('managerComment', formValue.managerComment!);
    formData.append('deduction', formValue.deduction?.toString()!);
    formValue.managerImages!.forEach((image: any) => {
      formData.append('images', image);
    });

    this.submitting = true;

    this.requestsService
      .approveRequest(formData, this.requestNumber)
      .pipe(finalize(() => (this.submitting = false)))
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

    const formValue = this.returnRequestForm.value;
    const formData = new FormData();

    formData.append('managerComment', formValue.managerComment!);
    formValue.managerImages!.forEach((image: any) => {
      formData.append('images', image);
    });

    this.submitting = true;

    this.requestsService
      .rejectRequest(formData, this.requestNumber)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe((request) => {
        this.request$.next(request);
        this.messageService.add({
          severity: 'success',
          summary: 'Запит відхилено',
          detail: 'Запит успішно відхилено',
        });
      });
  }

  deductionMax(control: AbstractControl): ValidationErrors | null {
    const deduction: number = control.get('deduction')?.value;
    const approvedItems: OrderReturnRequestItemEntity[] =
      control.get('approvedItems')?.value;

    if (!deduction) {
      return null;
    }

    const approvedItemsTotal = approvedItems.reduce(
      (acc: number, item: OrderReturnRequestItemEntity) =>
        acc + item!.quantity * item!.orderItem.productProperties.price,
      0,
    );

    if (deduction > approvedItemsTotal) {
      control.get('deduction')?.setErrors({ deductionMax: true });
    }

    return null;
  }

  onManagerImagesUpload(files: File[]) {
    this.managerImagesControl.controls = files.map((file) =>
      this.formBuilder.nonNullable.control(file),
    );
    this.managerImagesControl.updateValueAndValidity();
  }

  onManagerImageRemove(file: File) {
    this.managerImagesControl.controls =
      this.managerImagesControl.controls.filter(
        (control) => control.value !== file,
      );
    this.managerImagesControl.updateValueAndValidity();
  }

  confirmOrRejectToggle(action: Action) {
    this.confirmRejectHeader =
      action === Action.Approve ? CONFIRM_MESSAGE : REJECT_MESSAGE;
    this.acceptButtonStyleClass =
      action === Action.Approve ? 'p-button-success' : 'p-button-danger';

    this.cdRef.detectChanges();

    this.confirmationService.confirm({
      accept: () => {
        if (action === Action.Approve) {
          this.approveReturnRequest();
        } else {
          this.rejectReturnRequest();
        }
      },
    });
  }
}
