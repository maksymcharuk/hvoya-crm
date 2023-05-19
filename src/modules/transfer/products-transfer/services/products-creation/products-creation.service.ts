import { DataSource } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { FileEntity } from '@entities/file.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductColorEntity } from '@entities/product-color.entity';
import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductSizeEntity } from '@entities/product-size.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { uniqueObjectsArray } from '@utils/unique-objects-array.util';

import {
  NormalizedProductBase,
  NormalizedProductCategory,
  NormalizedProductColor,
  NormalizedProductSize,
  NormalizedProductVariant,
  NormalizedProductsData,
} from '../../interfaces/normalized-products-data.interface';

interface UpsetionError {
  error: Error;
  entity:
    | NormalizedProductBase
    | NormalizedProductCategory
    | NormalizedProductColor
    | NormalizedProductSize;
}

@Injectable()
export class ProductsCreationService {
  private errors: UpsetionError[] = [];

  constructor(private readonly dataSource: DataSource) {}

  async upsertProducts(productsData: NormalizedProductsData) {
    this.errors = [];

    await this.upsertDepencencies(productsData.products);
    await this.upsertMain(productsData.products);

    if (this.errors.length) {
      throw new HttpException(
        {
          message: 'Не вдалося завантажити деякі продукти',
          errors: this.errors,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async upsertDepencencies(products: NormalizedProductBase[]) {
    const productCategories = products
      .map((product) => product.category)
      .filter(
        (category) => category !== undefined,
      ) as NormalizedProductCategory[];
    const productColors = uniqueObjectsArray(
      products.reduce((acc, product) => {
        return [
          ...acc,
          ...product.variants.map((variant) => variant.properties.color),
        ];
      }, []),
      (currentEntity, nextEntity) => currentEntity.name === nextEntity.name,
    );
    const productSizes = uniqueObjectsArray(
      products.reduce((acc, product) => {
        return [
          ...acc,
          ...product.variants.map((variant) => variant.properties.size),
        ];
      }, []),
      (currentEntity, nextEntity) =>
        currentEntity.height === nextEntity.height &&
        currentEntity.width === nextEntity.width &&
        currentEntity.diameter === nextEntity.diameter,
    );

    for (let productCategory of productCategories) {
      try {
        await this.upsertProductCategory(productCategory);
      } catch (error) {
        this.errors.push({ error, entity: productCategory });
      }
    }

    for (let productColor of productColors) {
      try {
        await this.upsertProductColor(productColor);
      } catch (error) {
        this.errors.push({ error, entity: productColor });
      }
    }

    for (let productSize of productSizes) {
      try {
        await this.upsertProductSize(productSize);
      } catch (error) {
        this.errors.push({ error, entity: productSize });
      }
    }
  }

  private async upsertMain(products: NormalizedProductBase[]) {
    for (let product of products) {
      try {
        await this.upsertProductBase(product);
      } catch (error) {
        this.errors.push({ error, entity: product });
      }
    }
  }

  async upsertProductCategory(productCategory: NormalizedProductCategory) {
    const manager = this.dataSource.createEntityManager();
    const productCategoryExists = await manager
      .createQueryBuilder(ProductCategoryEntity, 'productCategory')
      .where(':externalId = ANY(productCategory.externalIds)', {
        externalId: productCategory.externalId,
      })
      .orWhere('productCategory.name = :name', { name: productCategory.name })
      .getOne();

    if (productCategoryExists) {
      await manager.update(ProductCategoryEntity, productCategoryExists.id, {
        name: productCategory.name,
        externalIds: Array.from(
          new Set([
            ...productCategoryExists.externalIds,
            productCategory.externalId,
          ]),
        ),
      });

      return productCategoryExists;
    }

    return manager.save(ProductCategoryEntity, {
      name: productCategory.name,
      externalIds: [productCategory.externalId],
    });
  }

  async upsertProductImage(url: string) {
    const manager = this.dataSource.createEntityManager();
    const productImageExists = await manager.findOne(FileEntity, {
      where: { url },
    });

    if (productImageExists) {
      return productImageExists;
    }

    return manager.save(FileEntity, { url });
  }

  async upsertProductColor(color: NormalizedProductColor) {
    const manager = this.dataSource.createEntityManager();
    const productColorExists = await manager
      .createQueryBuilder(ProductColorEntity, 'productColor')
      .where('productColor.name = :name', { name: color.name })
      .orWhere('productColor.hex = :hex', { hex: color.hex })
      .getOne();

    if (productColorExists) {
      return productColorExists;
    }

    return manager.save(ProductColorEntity, {
      name: color.name,
      hex: color.hex,
    });
  }

  async upsertProductSize(size: NormalizedProductSize) {
    const manager = this.dataSource.createEntityManager();
    const productSizeExists = await manager
      .createQueryBuilder(ProductSizeEntity, 'productSize')
      .where('productSize.height = :height', { height: size.height })
      .andWhere('productSize.width = :width', { width: size.width })
      .andWhere('productSize.diameter = :diameter', { diameter: size.diameter })
      .getOne();

    if (productSizeExists) {
      return productSizeExists;
    }

    return manager.save(ProductSizeEntity, {
      height: size.height,
      width: size.width,
      diameter: size.diameter,
    });
  }

  async upsertProductVariant(
    productVariant: NormalizedProductVariant,
    productBaseId: string,
  ) {
    const manager = this.dataSource.createEntityManager();
    const productVariantExists = await manager
      .createQueryBuilder(ProductVariantEntity, 'productVariant')
      .where(':externalId = ANY(productVariant.externalIds)', {
        externalId: productVariant.externalId,
      })
      .orWhere('productVariant.sku = :sku', { sku: productVariant.sku })
      .getOne();

    const properties = await manager.save(ProductPropertiesEntity, {
      name: productVariant.properties.name,
      description: productVariant.properties.description,
      price: productVariant.properties.price,
      weight: productVariant.properties.weight,
      images: await Promise.all(
        productVariant.properties.images.map((image) =>
          this.upsertProductImage(image.url),
        ),
      ),
      color: await this.upsertProductColor(productVariant.properties.color),
      size: await this.upsertProductSize(productVariant.properties.size),
    });

    if (productVariantExists) {
      await manager.update(ProductPropertiesEntity, properties.id, {
        product: { id: productVariantExists.id },
      });

      await manager.update(ProductVariantEntity, productVariantExists.id, {
        sku: productVariant.sku,
        externalIds: Array.from(
          new Set([
            ...productVariantExists.externalIds,
            productVariant.externalId,
          ]),
        ),
        baseProduct: { id: productBaseId },
        properties,
      });

      return productVariantExists;
    }

    const variant = await manager.save(ProductVariantEntity, {
      sku: productVariant.sku,
      externalIds: [productVariant.externalId],
      baseProduct: { id: productBaseId },
      properties,
    });

    await manager.update(ProductPropertiesEntity, properties.id, {
      product: { id: variant.id },
    });

    return variant;
  }

  async upsertProductBase(productBase: NormalizedProductBase) {
    const manager = this.dataSource.createEntityManager();
    const productBaseExists = await manager
      .createQueryBuilder(ProductBaseEntity, 'productBase')
      .where(':externalId = ANY(productBase.externalIds)', {
        externalId: productBase.externalId,
      })
      .orWhere('productBase.name = :name', { name: productBase.name })
      .getOne();

    if (productBaseExists) {
      await manager.update(ProductBaseEntity, productBaseExists.id, {
        name: productBase.name,
        externalIds: Array.from(
          new Set([...productBaseExists.externalIds, productBase.externalId]),
        ),
        category:
          productBase.category &&
          (await this.upsertProductCategory(productBase.category)),
      });

      await Promise.all(
        productBase.variants.map((variant) =>
          this.upsertProductVariant(variant, productBaseExists.id),
        ),
      );

      return productBaseExists;
    }

    const newProductBase = await manager.save(ProductBaseEntity, {
      name: productBase.name,
      externalIds: [productBase.externalId],
      category:
        productBase.category &&
        (await this.upsertProductCategory(productBase.category)),
    });

    await Promise.all(
      productBase.variants.map((variant) =>
        this.upsertProductVariant(variant, newProductBase.id),
      ),
    );

    return newProductBase;
  }
}
