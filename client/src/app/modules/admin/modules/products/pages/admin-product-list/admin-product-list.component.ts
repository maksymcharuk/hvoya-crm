import { Component } from '@angular/core';

import { ProductsService } from '@shared/services/products.service';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss'],
})
export class AdminProductListComponent {
  readonly productBase$ = this.productsService.productBase$;

  constructor(private readonly productsService: ProductsService) {}
}
