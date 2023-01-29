import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ProductVariantEntity } from '../../../entities/product-variant.entity';
import { ProductCategoryEntity } from '../../../entities/product-category.entity';
import { ProductBaseEntity } from '../../../entities/product-base.entity';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const productCategoryRepository = dataSource.getRepository(
      ProductCategoryEntity,
    );
    const productBaseRepository = dataSource.getRepository(ProductBaseEntity);
    const productVariantRepository =
      dataSource.getRepository(ProductVariantEntity);
    const productCategory = await productCategoryRepository.save([
      {
        name: 'Christmas trees',
      },
      {
        name: 'Christmas wreaths',
      },
    ]);
    const productBase = await productBaseRepository.save([
      {
        name: 'Classic tree',
        category: productCategory[0],
      },
      {
        name: 'Lux tree',
        category: productCategory[0],
      },
      {
        name: 'Classic wreaths',
        category: productCategory[1],
      },
      {
        name: 'Lux wreaths',
        category: productCategory[1],
      },
    ]);
    await productVariantRepository.save([
      {
        sku: 'CLSK-1',
        name: 'Classic tree1',
        description: 'Classic Christmas tree',
        size: '1.5m',
        color: 'green',
        price: 100,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[0],
      },
      {
        sku: 'CLSK-2',
        name: 'Classic tree2',
        description: 'Classic Christmas tree',
        size: '1.5m',
        color: 'blue',
        price: 100,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[0],
      },
      {
        sku: 'CLSK-3',
        name: 'Classic tree3',
        description: 'Classic Christmas tree',
        size: '1.2m',
        color: 'green',
        price: 50,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[0],
      },
      {
        sku: 'LUX-1',
        name: 'Lux tree1',
        description: 'Lux Christmas tree',
        size: '1.5m',
        color: 'blue',
        price: 100,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[1],
      },
      {
        sku: 'LUX-2',
        name: 'Lux tree2',
        description: 'Lux Christmas tree',
        size: '1.5m',
        color: 'green',
        price: 100,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[1],
      },
      {
        sku: 'CLSKW-1',
        name: 'Classic wreaths1',
        description: 'Classic wreaths',
        size: '1.5m',
        color: 'green',
        price: 100,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[2],
      },
      {
        sku: 'CLSKW-2',
        name: 'Classic wreaths2',
        description: 'Classic wreaths',
        size: '1.5m',
        color: 'blue',
        price: 100,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[2],
      },
      {
        sku: 'LUXW-1',
        name: 'Lux wreaths1',
        description: 'Lux wreaths',
        size: '1.5m',
        color: 'green',
        price: 100,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[3],
      },
      {
        sku: 'LUXW-2',
        name: 'Lux wreaths2',
        description: 'Lux wreaths',
        size: '1.5m',
        color: 'blue',
        price: 100,
        availableItemCount: 10,
        imageIds: [],
        baseProduct: productBase[3],
      },
    ]);
  }
}
