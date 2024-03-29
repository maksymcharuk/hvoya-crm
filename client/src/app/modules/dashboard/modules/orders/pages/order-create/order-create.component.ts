import { MessageService } from 'primeng/api';
import { catchError, finalize, map } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { WAYBILL_ACCEPTABLE_FILE_FORMATS } from '@shared/constants/order.constants';
import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { DeliveryType } from '@shared/enums/delivery-type.enum';
import {
  OrderCreateDTO,
  OrderCreateFormGroup,
} from '@shared/interfaces/dto/create-order.dto';
import { Cart, CartItem } from '@shared/interfaces/entities/cart.entity';
import { OrderCreateResponseError } from '@shared/interfaces/responses/order-create-error.response';
import { AccountService } from '@shared/services/account.service';
import { OrdersService } from '@shared/services/orders.service';
import { alphanumeric } from '@shared/validators/alphanumeric.validator';

import { UserBalanceService } from '../../../balance/services/user-balance.service';
import { CartService } from '../../../cart/services/cart/cart.service';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
})
export class OrderCreateComponent implements OnInit {
  cart$ = this.cartService.cart$;
  cartLoading$ = this.cartService.cartLoading$;
  cartNotEmpty$ = this.cartService.cartNotEmpty$;
  profile$ = this.accountService.profile$;
  balance$ = this.userBalanceService.balance$;
  submitting = false;
  isSelfPickup = false;
  deliveryServices = Object.values(DeliveryService);
  deliveryTypes = [
    { label: 'Склад - Склад', value: DeliveryType.WarehouseWarehouse },
    { label: 'Склад - Двері', value: DeliveryType.WarehouseDoor },
  ];
  fileFormats = WAYBILL_ACCEPTABLE_FILE_FORMATS;
  totalWeight$ = this.cart$.pipe(
    map((cart) => {
      return cart?.items.reduce((acc, item) => {
        acc += item.product.properties.weight * item.quantity;
        return acc;
      }, 0);
    }),
  );
  trackingIdValidators = [
    Validators.required,
    alphanumeric({ allowSpaces: true }),
  ];
  waybillValidators = [Validators.required];

  orderCreateForm = this.formBuilder.group({
    // NOTE: Keep this for a waybill generation logic in future
    // email: ['', [Validators.required, Validators.email]],
    // firstName: ['', Validators.required],
    // lastName: ['', Validators.required],
    // middleName: ['', Validators.required],
    // phoneNumber: ['', Validators.required],
    deliveryService: [DeliveryService.NovaPoshta, Validators.required],
    trackingId: ['', this.trackingIdValidators],
    // NOTE: Keep this for a waybill generation logic in future
    // deliveryType: [this.deliveryTypes[0]?.value, Validators.required],
    // city: ['', Validators.required],
    // postOffice: ['', Validators.required],
    waybill: ['', this.waybillValidators],
    customerNote: [''],
  }) as OrderCreateFormGroup;

  get trackingId() {
    return this.orderCreateForm.get('trackingId');
  }

  get waybill() {
    return this.orderCreateForm.get('waybill');
  }

  get deliveryService() {
    return this.orderCreateForm.get('deliveryService');
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrdersService,
    private accountService: AccountService,
    private messageService: MessageService,
    private userBalanceService: UserBalanceService,
  ) {}

  ngOnInit(): void {
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.orderCreateForm.patchValue({
          email: profile.email,
        });
      }
    });

    this.trackingId?.valueChanges.subscribe(() => {
      this.trackingId?.patchValue(this.trackingId?.value.toUpperCase(), {
        emitEvent: false,
      });
    });

    this.deliveryService?.valueChanges.subscribe((value) => {
      if (value === DeliveryService.SelfPickup) {
        this.isSelfPickup = true;
        this.trackingId?.clearValidators();
        this.trackingId?.disable();
        this.waybill?.clearValidators();
        this.waybill?.disable();
      } else {
        this.isSelfPickup = false;
        this.trackingId?.setValidators(this.trackingIdValidators);
        this.trackingId?.enable();
        this.waybill?.setValidators(this.waybillValidators);
        this.waybill?.enable();
      }
      this.trackingId?.updateValueAndValidity();
      this.waybill?.updateValueAndValidity();
    });
  }

  onFileUpload(event: any) {
    this.waybill?.patchValue(event.files[0]);
  }

  identify(_index: number, item: CartItem) {
    return item.product.id;
  }

  orderCreate() {
    if (!this.orderCreateForm.valid) {
      this.orderCreateForm.markAllAsTouched();
      return;
    }
    this.submitting = true;

    const formData = new FormData();
    const value = this.orderCreateForm.value;

    Object.keys(value).forEach((key) => {
      if (value[key as keyof OrderCreateDTO]) {
        formData.append(key, value[key as keyof OrderCreateDTO] as string);
      }
    });

    this.orderService
      .orderCreate(formData)
      .pipe(
        finalize(() => {
          this.submitting = false;
        }),
        catchError((err: OrderCreateResponseError) => {
          if (err.error.cart) {
            this.cartService.cart$.next(new Cart(err.error.cart));
          }
          return [];
        }),
      )
      .subscribe((order) => {
        this.cartService.getCart();
        this.userBalanceService.getUserBalance();
        this.messageService.add({
          severity: 'success',
          summary: 'Замовлення успішно створено',
          detail: `Ваше замовлення №${order.number} успішно створено`,
        });
        this.router.navigate(['/dashboard/orders', order.number]);
      });
  }
}
