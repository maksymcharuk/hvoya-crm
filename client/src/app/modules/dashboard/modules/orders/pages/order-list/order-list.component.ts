import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { Component, OnDestroy } from '@angular/core';

import { Order } from '@shared/interfaces/entities/order.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { OrdersService } from '@shared/services/orders.service';

@Component({
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnDestroy {
  destroyed$ = new Subject<void>();
  pageOrders$ = new BehaviorSubject<Page<Order> | null>(null);

  constructor(private ordersService: OrdersService) {}

  loadOrders(pageOptions: PageOptions) {
    this.ordersService
      .getOrders(pageOptions)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((orders) => {
        this.pageOrders$.next(orders);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
