import { Component } from '@angular/core';
import { ProductsService } from '@shared/services/products.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss'],
})
export class AdminProductListComponent {
  productList$ = this.productsService
    .getProducts()
    .pipe(finalize(() => (this.isLoading = false)));
  isLoading = true;

  constructor(private productsService: ProductsService) {}
}
