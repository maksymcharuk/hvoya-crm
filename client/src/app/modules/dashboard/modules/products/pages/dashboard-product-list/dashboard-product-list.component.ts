import { Component } from '@angular/core';

import { ProductsService } from '@shared/services/products.service';

@Component({
  selector: 'app-dashboard-product-list',
  templateUrl: './dashboard-product-list.component.html',
  styleUrls: ['./dashboard-product-list.component.scss'],
})
export class DashboardProductListComponent {
  readonly productBase$ = this.productsService.productBase$;

  constructor(private readonly productsService: ProductsService) {}
}
