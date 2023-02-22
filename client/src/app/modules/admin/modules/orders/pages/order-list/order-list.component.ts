import { Component } from '@angular/core';

import { OrdersService } from '@shared/services/orders.service';

@Component({
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  orders$ = this.ordersService.getOrders();

  constructor(private ordersService: OrdersService) {}
}
