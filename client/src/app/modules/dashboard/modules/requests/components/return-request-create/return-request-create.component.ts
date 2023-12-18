import { MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import {
  BehaviorSubject,
  Observable,
  filter,
  finalize,
  share,
  switchMap,
} from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IMAGE_ACCEPTABLE_FILE_FORMATS,
  WAYBILL_ACCEPTABLE_FILE_FORMATS,
} from '@shared/constants/order.constants';
import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { RequestType } from '@shared/enums/request-type.enum';
import { Order, OrderItem } from '@shared/interfaces/entities/order.entity';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { RequestItemUIEntity } from '@shared/interfaces/ui-entities/request-item.ui-entity';
import { OrdersService } from '@shared/services/orders.service';
import { RequestsService } from '@shared/services/requests.service';
import { UserService } from '@shared/services/user.service';
import { alphanumeric } from '@shared/validators/alphanumeric.validator';

@Component({
  selector: 'app-return-request-create',
  templateUrl: './return-request-create.component.html',
  styleUrls: ['./return-request-create.component.scss'],
})
export class ReturnRequestCreateComponent {
  @ViewChild('orderNumberDropdown') orderNumberDropdown?: Dropdown;

  deliveryServices = Object.values(DeliveryService).filter(
    (value) => value !== DeliveryService.SelfPickup,
  );
  fileFormats = WAYBILL_ACCEPTABLE_FILE_FORMATS;
  imageFormats = IMAGE_ACCEPTABLE_FILE_FORMATS;
  submitting = false;
  orderNumberList$: Observable<string[]> = this.ordersService
    .getOrderNumberListForReturnRequest()
    .pipe(share());
  order$ = new BehaviorSubject<Order | null>(null);

  returnRequestForm = this.formBuilder.nonNullable.group({
    orderNumber: this.formBuilder.nonNullable.control<string>(
      '',
      Validators.required,
    ),
    trackingId: this.formBuilder.nonNullable.control<string>('', [
      Validators.required,
      alphanumeric({ allowSpaces: true }),
    ]),
    waybill: this.formBuilder.nonNullable.control<File | null>(null),
    customerImages: this.formBuilder.nonNullable.array<File>([]),
    deliveryService: this.formBuilder.nonNullable.control<DeliveryService>(
      DeliveryService.NovaPoshta,
      Validators.required,
    ),
    requestedItems: this.formBuilder.nonNullable.array<RequestItemUIEntity>([]),
    customerComment: this.formBuilder.nonNullable.control<string>(
      '',
      Validators.required,
    ),
    requestType: this.formBuilder.nonNullable.control<RequestType>(
      RequestType.Return,
      Validators.required,
    ),
  });

  get orderNumberControl(): AbstractControl<string> {
    return this.returnRequestForm.controls.orderNumber;
  }

  get requestedItems(): FormArray<FormControl<RequestItemUIEntity>> {
    return this.returnRequestForm.controls.requestedItems;
  }

  get waybillControl(): AbstractControl {
    return this.returnRequestForm.controls.waybill;
  }

  get customerImagesControl(): FormArray<FormControl<File>> {
    return this.returnRequestForm.controls.customerImages;
  }

  constructor(
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private requestsService: RequestsService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
  ) {
    this.orderNumberList$.subscribe((orders) => {
      this.setOrderNumber(
        orders,
        this.route.snapshot.queryParams['orderNumber'],
      );
    });
    this.orderNumberControl.valueChanges
      .pipe(switchMap((value) => this.ordersService.getOrder(value)))
      .pipe(
        share(),
        finalize(() => (this.submitting = false)),
      )
      .subscribe(this.order$);

    this.order$.pipe(filter((order) => !!order)).subscribe((order) => {
      this.onOrderChange(order!);
    });
  }

  ngAfterViewInit(): void {
    // TODO: remove this hack and update primeng version
    if (this.orderNumberDropdown) {
      (this.orderNumberDropdown.filterBy as any) = {
        split: (_: any) => [(item: any) => item],
      };
    }
  }

  onSubmit() {
    const formValue = this.returnRequestForm.value;

    if (!this.returnRequestForm.valid) {
      this.returnRequestForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formData = new FormData();

    const value = {
      customerComment: formValue.customerComment,
      requestType: formValue.requestType,
      returnRequest: {
        trackingId: formValue.trackingId,
        deliveryService: formValue.deliveryService,
        requestedItems: formValue.requestedItems,
        orderNumber: formValue.orderNumber,
      },
      waybill: formValue.waybill,
      customerImages: formValue.customerImages,
    };

    formData.append('customerComment', value.customerComment!);
    formData.append('requestType', value.requestType!);
    formData.append('returnRequest', JSON.stringify(value.returnRequest));
    formData.append('documents', value.waybill!);
    value.customerImages!.forEach((image: File) => {
      formData.append('images', image);
    });

    this.requestsService
      .createRequest(formData)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe((request: RequestEntity) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Запит створено',
          detail: 'Запит успішно створено',
        });

        const path = this.userService.getUser()?.isAnyAdmin
          ? '/admin'
          : '/dashboard';
        this.router.navigate([
          `${path}/requests/return-requests/${request.number}`,
        ]);
      });
  }

  onOrderChange(order: Order) {
    this.requestedItems.clear();

    if (order) {
      order.items.forEach((item: OrderItem) => {
        this.requestedItems.push(
          this.formBuilder.nonNullable.control(
            new RequestItemUIEntity({
              quantity: item.quantity,
              orderItem: item,
            }),
          ),
        );
      });
    }
  }

  onWaybillUpload(files: File[]) {
    this.waybillControl.patchValue(files[0]);
  }

  onWaybillRemove() {
    this.waybillControl.patchValue(null);
  }

  onCustomerImagesUpload(files: File[]) {
    this.customerImagesControl.controls = files.map((file) =>
      this.formBuilder.nonNullable.control(file),
    );
    this.customerImagesControl.updateValueAndValidity();
  }

  onCustomerImageRemove(file: File) {
    this.customerImagesControl.controls =
      this.customerImagesControl.controls.filter(
        (control) => control.value !== file,
      );
    this.customerImagesControl.updateValueAndValidity();
  }

  private setOrderNumber(orderNumberList: string[], orderNumber?: string) {
    if (!orderNumber) {
      return;
    }

    const orderNumberFound = orderNumberList.find(
      (number) => number === orderNumber,
    );

    if (!orderNumberFound) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка',
        detail:
          'Замовлення не знайдено або для даного замовлення не можна оформити повернення',
      });
      return;
    }

    this.orderNumberControl.patchValue(orderNumberFound);
  }
}
