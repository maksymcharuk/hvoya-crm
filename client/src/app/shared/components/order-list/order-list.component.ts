import { Table } from 'primeng/table';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { OrderStatus } from '@shared/enums/order-status.enum';
import { Order } from '@shared/interfaces/order.interface';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnDestroy {
  loading = true;
  searchForm = this.fb.group({
    search: [''],
  });
  orderStatuses = Object.entries(OrderStatus).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });

  private orderInternal: Order[] = [];
  private destroy$ = new Subject();

  @Input() adminView = false;
  @Input() set orders(orders: Order[] | null) {
    if (!orders) {
      return;
    }
    this.orderInternal = orders;
    this.loading = false;
  }
  @ViewChild('ordersTable') ordersTable!: Table;

  get orders(): any[] {
    return this.orderInternal.map((order) => ({
      ...order,
      createdAt: new Date(order.createdAt),
    }));
  }

  get globalFilterFields() {
    const defaultFilterFields = ['total'];
    return this.adminView
      ? [...defaultFilterFields, 'customer.firstName', 'customer.lastName']
      : defaultFilterFields;
  }

  get searchControl() {
    return this.searchForm.get('search');
  }

  constructor(private fb: FormBuilder) {
    this.searchControl?.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.ordersTable.filterGlobal(query, 'contains');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getPreviewThumbs(order: Order) {
    return order.items
      .map((item) => ({
        url: item.productProperties.images[0]?.url,
        alt: item.productProperties.name,
      }))
      .slice(0, 3);
  }

  getOrderItemsNumber(order: Order) {
    return order.items.reduce((acc, item) => acc + item.quantity, 0);
  }
}
