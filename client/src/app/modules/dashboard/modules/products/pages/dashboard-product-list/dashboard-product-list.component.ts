import { Component } from '@angular/core';
import { ProductsService } from '@shared/services/products.service';
import { share } from 'rxjs';

@Component({
  selector: 'app-dashboard-product-list',
  templateUrl: './dashboard-product-list.component.html',
  styleUrls: ['./dashboard-product-list.component.scss'],
})
export class DashboardProductListComponent {
  productList$ = this.productsService.getProducts().pipe(share());
  isLoading = true;

  constructor(private productsService: ProductsService) {
    this.productList$.subscribe(() => (this.isLoading = false));
  }
}
