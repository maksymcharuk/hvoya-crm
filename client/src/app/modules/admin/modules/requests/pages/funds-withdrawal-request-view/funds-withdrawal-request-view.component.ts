import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, finalize } from 'rxjs';

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FundsWithdrawalRequestStatus } from '@shared/enums/funds-withdrawal-request-status.enum';
import { RequestAction } from '@shared/enums/request-action.enum';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { RequestsService } from '@shared/services/requests.service';

const CONFIRM_MESSAGE =
  'Ви справді хочете підтвердити цей запит на виведення коштів?';
const REJECT_MESSAGE =
  'Ви справді хочете відхилити цей запит на вивелення коштів?';

@Component({
  selector: 'app-funds-withdrawal-request-view',
  templateUrl: './funds-withdrawal-request-view.component.html',
  styleUrls: ['./funds-withdrawal-request-view.component.scss'],
})
export class FundsWithdrawalRequestViewComponent {
  requestNumber = this.route.snapshot.params['number'];
  request$ = new BehaviorSubject<RequestEntity | null>(null);
  fundsWithdrawalRequestStatus = FundsWithdrawalRequestStatus;
  confirmRejectHeader = '';
  acceptButtonStyleClass = '';
  submitting = false;
  action = RequestAction;
  showReceiptViewDialog = false;

  fundsWithdrawalRequestForm = this.formBuilder.group({
    managerComment: this.formBuilder.control<string>(''),
    receipt: this.formBuilder.control<File | null>(null, Validators.required),
  });

  get managerCommentControl(): AbstractControl {
    return this.fundsWithdrawalRequestForm.controls.managerComment;
  }

  get receiptControl(): AbstractControl {
    return this.fundsWithdrawalRequestForm.controls.receipt;
  }

  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestsService: RequestsService,
    private readonly formBuilder: FormBuilder,
    private readonly cdRef: ChangeDetectorRef,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {
    this.requestsService.getRequest(this.requestNumber).subscribe((request) => {
      this.request$.next(request);
    });
  }

  showReceiptViewDialogHandler() {
    this.showReceiptViewDialog = true;
  }

  approveReturnRequest() {
    this.managerCommentControl.clearValidators();
    this.managerCommentControl.updateValueAndValidity();
    this.receiptControl.setValidators([Validators.required]);
    this.receiptControl.updateValueAndValidity();

    if (this.fundsWithdrawalRequestForm.invalid) {
      this.fundsWithdrawalRequestForm.markAllAsTouched();
      return;
    }

    const formValue = this.fundsWithdrawalRequestForm.value;
    const formData = new FormData();

    formData.append('managerComment', formValue.managerComment!);
    formData.append('documents', formValue.receipt!);

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
    this.receiptControl.clearValidators();
    this.receiptControl.updateValueAndValidity();
    this.managerCommentControl.setValidators([Validators.required]);
    this.managerCommentControl.updateValueAndValidity();

    if (this.fundsWithdrawalRequestForm.invalid) {
      this.fundsWithdrawalRequestForm.markAllAsTouched();
      return;
    }

    const formValue = this.fundsWithdrawalRequestForm.value;
    const formData = new FormData();

    formData.append('managerComment', formValue.managerComment!);
    formData.append('documents', formValue.receipt!);

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

  confirmOrRejectToggle(action: RequestAction) {
    this.confirmRejectHeader =
      action === RequestAction.Approve ? CONFIRM_MESSAGE : REJECT_MESSAGE;
    this.acceptButtonStyleClass =
      action === RequestAction.Approve ? 'p-button-success' : 'p-button-danger';

    this.cdRef.detectChanges();

    this.confirmationService.confirm({
      accept: () => {
        if (action === RequestAction.Approve) {
          this.approveReturnRequest();
        } else {
          this.rejectReturnRequest();
        }
      },
    });
  }

  onReceiptUpload(files: File[]) {
    const [receipt] = files;
    this.receiptControl.setValue(receipt);
    this.receiptControl.updateValueAndValidity();
  }

  onReceiptRemove() {
    this.receiptControl.reset();
    this.receiptControl.updateValueAndValidity();
  }
}
