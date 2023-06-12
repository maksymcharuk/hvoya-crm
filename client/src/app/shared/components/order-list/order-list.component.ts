import { Table } from 'primeng/table';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { OrderDeliveryStatus } from '@shared/enums/order-delivery-status.enum';
import { OrderStatus } from '@shared/enums/order-status.enum';
import { Order } from '@shared/interfaces/entities/order.entity';
import { User } from '@shared/interfaces/entities/user.entity';
import { getUniqueObjectsByKey } from '@shared/utils/get-unique-objects-by-key.util';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnDestroy {
  @Input() adminView = false;
  @Input() set orders(orders: Order[] | null) {
    if (!orders) {
      return;
    }
    this.customers = this.getUniqueCustomers(orders);
    this.orderInternal = orders;
    this.loading = false;
  }
  @ViewChild('ordersTable') ordersTable!: Table;

  loading = true;
  customers: User[] = []
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
  orderDeliveryStatuses = Object.entries(OrderDeliveryStatus).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });

  get orders(): any[] {
    return this.orderInternal;
  }

  get globalFilterFields() {
    const defaultFilterFields = ['total'];
    return this.adminView
      ? [...defaultFilterFields, 'customer.firstName', 'customer.lastName', 'customer.middleName', 'delivery.trackingId']
      : defaultFilterFields;
  }

  get searchControl() {
    return this.searchForm.get('search');
  }

  private orderInternal: any[] = [];
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
  ) {
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

  getUniqueCustomers(orders: Order[]) {
    const customers = orders.map((order) => order.customer);
    return getUniqueObjectsByKey(customers, 'id')
  }

  filterByName(customers: User[]) {
    this.ordersTable.filter(customers.map((customer) => customer.fullName), 'customer.fullName', 'in');
  }
}
