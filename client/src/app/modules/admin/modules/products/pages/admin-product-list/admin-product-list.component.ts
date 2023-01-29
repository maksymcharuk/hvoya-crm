import { Component } from '@angular/core';
import { ProductsService } from '@shared/services/products.service';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss'],
})
export class AdminProductListComponent {
  productList$ = this.productsService.getProducts();
  isLoading = true;

  constructor(private productsService: ProductsService) {
    this.productList$.subscribe(() => (this.isLoading = false));
  }
}
