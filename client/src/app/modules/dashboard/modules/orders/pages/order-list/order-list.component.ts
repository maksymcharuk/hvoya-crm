import { Table } from 'primeng/table';
import { map, share } from 'rxjs';

import { Component, ViewChild } from '@angular/core';

import { OrderStatus } from '@shared/enums/order-status.enum';
import { Order } from '@shared/interfaces/order.interface';

import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  @ViewChild('ordersTable') ordersTable!: Table;

  orders$ = this.ordersService.getOrders().pipe(
    map((orders: Order[]) =>
      orders.map((order) => ({
        ...order,
        createdAt: new Date(order.createdAt),
      })),
    ),
    share(),
  );
  orderStatuses = Object.entries(OrderStatus).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });

  constructor(private ordersService: OrdersService) {}

  search(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.ordersTable.filterGlobal(target.value, 'contains');
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
