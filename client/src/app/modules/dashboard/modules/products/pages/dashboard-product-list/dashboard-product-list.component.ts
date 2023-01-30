import { Component } from '@angular/core';
import { ProductsService } from '@shared/services/products.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-product-list',
  templateUrl: './dashboard-product-list.component.html',
  styleUrls: ['./dashboard-product-list.component.scss'],
})
export class DashboardProductListComponent {
  productList$ = this.productsService
    .getProducts()
    .pipe(finalize(() => (this.isLoading = false)));
  isLoading = true;

  constructor(private productsService: ProductsService) {}
}
