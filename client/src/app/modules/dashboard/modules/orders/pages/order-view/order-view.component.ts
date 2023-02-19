import { Observable } from 'rxjs';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GetOrderResponse } from '@shared/interfaces/responses/get-order.response';

import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent {
  order$: Observable<GetOrderResponse>;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
  ) {
    this.order$ = this.ordersService.getOrder(this.route.snapshot.params['id']);
  }
}
