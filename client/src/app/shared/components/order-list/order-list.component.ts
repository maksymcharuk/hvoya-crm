import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, debounceTime, map, takeUntil } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { DeliveryStatus } from '@shared/enums/delivery-status.enum';
import { OrderStatus } from '@shared/enums/order-status.enum';
import { Role } from '@shared/enums/role.enum';
import { Order } from '@shared/interfaces/entities/order.entity';
import { User } from '@shared/interfaces/entities/user.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { UserService } from '@shared/services/user.service';
import { getUniqueObjectsByKey } from '@shared/utils/get-unique-objects-by-key.util';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnDestroy {
  @Input() adminView = false;
  @Input() set orders(orders: Page<Order> | null) {
    this.orderInternal = orders;
    if (orders) {
      this.loading = false;
    }
  }
  @Output() onLoadData = new EventEmitter<PageOptions>();
  @ViewChild('ordersTable') ordersTable!: Table;

  loading = true;
  rows = 20;
  customers$ = this.userService
    .getUsers(
      new PageOptions({
        rows: 0,
        filters: { roles: { value: [Role.User] } },
      }),
    )
    .pipe(map((users) => users.data));
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
  orderDeliveryStatuses = Object.entries(DeliveryStatus).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });

  get orders(): Page<Order> | null {
    return this.orderInternal;
  }

  get searchControl() {
    return this.searchForm.get('search');
  }

  private orderInternal: Page<Order> | null = null;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private readonly userService: UserService,
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
    return getUniqueObjectsByKey(customers, 'id');
  }

  filterByCustomer(customers: User[]) {
    this.ordersTable.filter(
      customers.map((customer) => customer.id),
      'customerIds',
      'in',
    );
  }

  onLazyLoad(event: LazyLoadEvent) {
    this.loading = true;
    if (this.orders) {
      this.orders.data = [];
    }
    this.onLoadData.emit(new PageOptions(event));
  }
}
