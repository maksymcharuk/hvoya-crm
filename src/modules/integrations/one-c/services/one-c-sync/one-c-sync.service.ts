import Decimal from 'decimal.js';
import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { SyncProduct } from '@interfaces/one-c';

import { OneCApiService } from '../one-c-api/one-c-api.service';

@Injectable()
export class OneCSyncService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly oneCApiService: OneCApiService,
  ) {}

  async syncProducts(): Promise<void> {
    const products = await this.dataSource.manager.find(ProductVariantEntity, {
      relations: ['properties'],
    });
    const oneCProducts = await this.oneCApiService.syncProducts();

    for (let product of products) {
      const newProduct = oneCProducts.find(
        (oneCProduct) => oneCProduct.sku === product.sku,
      );
      if (!newProduct) {
        continue;
      }
      await this.updateProperties(product, newProduct);
      // Update non-properties fields (stock, etc.)
      await this.dataSource.manager.update(ProductVariantEntity, product.id, {
        stock: newProduct.stock,
      });
    }
  }

  // Create new properties if needed
  private async updateProperties(
    product: ProductVariantEntity,
    newProduct: SyncProduct,
  ): Promise<void> {
    if (!newProduct.price) {
      return;
    }

    if (product.properties.price.toNumber() !== newProduct.price) {
      const properties = await this.dataSource.manager.save(
        ProductPropertiesEntity,
        {
          ...{ ...product.properties, id: undefined },
          price: new Decimal(newProduct.price),
        },
      );
      await this.dataSource.manager.update(ProductVariantEntity, product.id, {
        properties: properties ?? product.properties,
      });
    }
  }
}
