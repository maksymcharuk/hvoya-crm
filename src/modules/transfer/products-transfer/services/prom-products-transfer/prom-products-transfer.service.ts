import { Injectable } from '@nestjs/common';

import { PromProducts } from '../../interfaces/prom-products.interface';
import { ProductsCreationService } from '../products-creation/products-creation.service';
import { PromProductsNormalizationService } from './helper-services/prom-products-normalization/prom-products-normalization.service';

@Injectable()
export class PromProductsTransferService {
  constructor(
    private readonly promProductsNormalizationService: PromProductsNormalizationService,
    private readonly productsCreationService: ProductsCreationService,
  ) {}
  async import(data: PromProducts) {
    const normalizedData =
      this.promProductsNormalizationService.normalize(data);
    return this.productsCreationService.upsertProducts(normalizedData);
  }
}
