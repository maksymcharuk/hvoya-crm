import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';

import { Order } from '@shared/interfaces/entities/order.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { OrdersService } from '@shared/services/orders.service';

@Component({
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  pageOrders$ = new BehaviorSubject<Page<Order> | null>(null);

  constructor(private ordersService: OrdersService) {}

  loadOrders(pageOptions: PageOptions) {
    this.ordersService.getOrders(pageOptions).subscribe((orders) => {
      this.pageOrders$.next(orders);
    });
  }
}
