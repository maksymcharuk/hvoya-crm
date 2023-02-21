import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CartItem } from '@shared/interfaces/cart.interface';
import {
  OrderCreateDTO,
  OrderCreateFormGroup,
} from '@shared/interfaces/dto/create-order.dto';
import { AccountService } from '@shared/services/account.service';

import { CartService } from '../../../cart/services/cart/cart.service';
import { OrdersService } from '../../services/orders/orders.service';

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
  submitting = false;

  orderCreateForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    middleName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    trackingId: ['', Validators.required],
    deliveryType: ['', Validators.required],
    city: ['', Validators.required],
    postOffice: ['', Validators.required],
    waybill: [''],
  }) as OrderCreateFormGroup;

  get waybill() {
    return this.orderCreateForm.get('waybill');
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrdersService,
    private accountService: AccountService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.orderCreateForm.patchValue({
          email: profile.email,
        });
      }
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
      )
      .subscribe((order) => {
        this.cartService.getCart();
        this.messageService.add({
          severity: 'success',
          summary: 'Замовлення успішно створено',
          detail: `Ваше замовлення №${order.id} успішно створено`,
        });
        this.router.navigate(['/dashboard/orders', order.id]);
      });
  }
}
