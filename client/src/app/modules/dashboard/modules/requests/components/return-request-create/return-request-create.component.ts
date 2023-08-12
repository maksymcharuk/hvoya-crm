import { MessageService } from 'primeng/api';
import { BehaviorSubject, finalize } from 'rxjs';

import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { WAYBILL_ACCEPTABLE_FILE_FORMATS } from '@shared/constants/order.constants';
import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { RequestType } from '@shared/enums/request-type.enum';
import { CreateReturnRequestFormGroup } from '@shared/interfaces/dto/create-return-request.dto';
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
  waybillSubmitting$ = new BehaviorSubject<boolean>(false);

  deliveryServices = Object.keys(DeliveryService);
  fileFormats = WAYBILL_ACCEPTABLE_FILE_FORMATS;
  orderSelected = false;
  submitting = false;
  selectedOrder!: Order;

  returnRequestForm = this.formBuilder.group({
    trackingId: [
      '',
      [Validators.required, alphanumeric({ allowSpaces: true })],
    ],
    waybill: ['', Validators.required],
    deliveryService: [this.deliveryServices[0], Validators.required],
    requestedItems: this.formBuilder.array([]),
    customerComment: ['', Validators.required],
    requestType: [RequestType.Return],
  }) as CreateReturnRequestFormGroup;

  get requestedItems() {
    return this.returnRequestForm.controls[
      'requestedItems'
    ] as FormArray<FormControl>;
  }

  get waybillControl(): AbstractControl {
    return this.returnRequestForm.controls.waybill;
  }

  orders: Order[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private requestsService: RequestsService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {
    this.ordersService.getOrdersForReturnRequest().subscribe((orders) => {
      this.orders = orders;
    });
  }

  onSubmit(value: any) {
    if (!this.returnRequestForm.valid) {
      this.returnRequestForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formData = new FormData();

    value = {
      customerComment: value.customerComment,
      requestType: value.requestType,
      returnRequest: {
        trackingId: value.trackingId,
        deliveryService: value.deliveryService,
        requestedItems: value.requestedItems,
        orderNumber: this.selectedOrder.number,
      },
      waybill: value.waybill,
    };

    formData.append('customerComment', value.customerComment);
    formData.append('requestType', value.requestType);
    formData.append('returnRequest', JSON.stringify(value.returnRequest));
    formData.append('waybill', value.waybill);

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

  onOrderSelected(order: Order) {
    this.requestedItems.clear();
    this.orderSelected = false;
    this.selectedOrder = order;

    if (order) {
      order.items.forEach((item: OrderItem) => {
        this.requestedItems.push(
          this.formBuilder.control(
            new RequestItemUIEntity({
              quantity: item.quantity,
              orderItem: item,
            }),
          ),
        );
      });
      this.orderSelected = true;
    }
  }

  onFileUpload(event: any) {
    this.waybillControl.patchValue(event.files[0]);
  }
}
