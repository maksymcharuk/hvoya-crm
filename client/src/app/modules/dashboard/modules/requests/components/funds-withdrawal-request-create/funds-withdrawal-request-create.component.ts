import { MessageService } from 'primeng/api';
import { combineLatest, finalize, mergeMap, of } from 'rxjs';

import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IMAGE_ACCEPTABLE_FILE_FORMATS,
  WAYBILL_ACCEPTABLE_FILE_FORMATS,
} from '@shared/constants/order.constants';
import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { RequestType } from '@shared/enums/request-type.enum';
import { RequestsService } from '@shared/services/requests.service';
import { UserService } from '@shared/services/user.service';

import { UserBalanceService } from '../../../balance/services/user-balance.service';

@Component({
  selector: 'app-funds-withdrawal-request-create',
  templateUrl: './funds-withdrawal-request-create.component.html',
  styleUrls: ['./funds-withdrawal-request-create.component.scss'],
})
export class FundsWithdrawalRequestCreateComponent {
  deliveryServices = Object.keys(DeliveryService);
  fileFormats = WAYBILL_ACCEPTABLE_FILE_FORMATS;
  imageFormats = IMAGE_ACCEPTABLE_FILE_FORMATS;
  submitting = false;

  fundsWithdrawalRequestForm = this.formBuilder.nonNullable.group({
    amount: this.formBuilder.nonNullable.control<number>(0, [
      Validators.required,
      Validators.min(1),
    ]),
    customerComment: this.formBuilder.nonNullable.control<string>('', [
      Validators.required,
    ]),
    requestType: this.formBuilder.nonNullable.control<RequestType>(
      RequestType.FundsWithdrawal,
      Validators.required,
    ),
  });

  get amountControl(): AbstractControl {
    return this.fundsWithdrawalRequestForm.controls.amount;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly requestsService: RequestsService,
    private readonly userBalanceService: UserBalanceService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  onSubmit() {
    const formValue = this.fundsWithdrawalRequestForm.value;

    if (!this.fundsWithdrawalRequestForm.valid) {
      this.fundsWithdrawalRequestForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formData = new FormData();

    const value = {
      customerComment: formValue.customerComment,
      requestType: formValue.requestType,
      fundsWithdrawalRequest: {
        amount: formValue.amount,
      },
    };

    formData.append('customerComment', value.customerComment!);
    formData.append('requestType', value.requestType!);
    formData.append(
      'fundsWithdrawalRequest',
      JSON.stringify(value.fundsWithdrawalRequest),
    );

    this.requestsService
      .createRequest(formData)
      .pipe(
        finalize(() => (this.submitting = false)),
        mergeMap((request) => {
          return combineLatest([
            of(request),
            this.userBalanceService.getUserBalance(),
          ]);
        }),
      )
      .subscribe(([request]) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Запит створено',
          detail: 'Запит успішно створено',
        });

        const path = this.userService.getUser()?.isAnyAdmin
          ? '/admin'
          : '/dashboard';
        this.router.navigate([
          `${path}/requests/funds-withdrawal-requests/${request.number}`,
        ]);
      });
  }
}
