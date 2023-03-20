import { Component, Input } from '@angular/core';

import { OrderItem } from '@shared/interfaces/entities/order.entity';

@Component({
  selector: 'app-order-view-item',
  templateUrl: './order-view-item.component.html',
  styleUrls: ['./order-view-item.component.scss'],
})
export class OrderViewItemComponent {
  @Input() orderItem!: OrderItem;
}
