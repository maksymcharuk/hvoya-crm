import { Observable } from 'rxjs';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductBase } from '@shared/interfaces/entities/product.entity';
import { ProductsService } from '@shared/services/products.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent {
  product$: Observable<ProductBase>;
  selectedVariantId!: string;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
  ) {
    this.product$ = this.productsService.getProduct(
      this.route.snapshot.params['baseId'],
    );
    this.selectedVariantId = this.route.snapshot.params['variantId'];
  }
}
