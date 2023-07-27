import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ProductColor } from '@modules/transfer/products-transfer/enums/product-color.enum';
import { PromProductsXlsRaw } from '@modules/transfer/products-transfer/interfaces/prom-products-xls-raw.interface';
import {
  PromProductXls,
  PromProductsXls,
} from '@modules/transfer/products-transfer/interfaces/prom-products-xls.interface';
import { productColorsMap } from '@modules/transfer/products-transfer/maps/product-colors.map';
import { converRawPromProductXslToPromProductXsl } from '@modules/transfer/products-transfer/maps/prom-products-xls-fields.map';

import {
  NormalizedProductBase,
  NormalizedProductColor,
  NormalizedProductSize,
  NormalizedProductsData,
} from '../../../interfaces/normalized-products-data.interface';
import { BaseNormalizationService } from '../../base-normalization/base-normalization.service';
import {
  getColorBaseOnSku,
  getDataBaseOnSku,
} from '../utils/products-normalization.util';

@Injectable()
export class PromProductsNormalizationServiceXls
  implements BaseNormalizationService<PromProductsXlsRaw>
{
  normalize(rawData: PromProductsXlsRaw): NormalizedProductsData {
    let products: NormalizedProductBase[] | undefined = [];
    const data: PromProductsXls = rawData.map((product) =>
      converRawPromProductXslToPromProductXsl(product),
    );

    try {
      const productBaseList = data.reduce(
        (acc: NormalizedProductBase[], product: PromProductXls) => {
          const isProductBaseExist = acc.find(
            (baseProduct) => baseProduct.name === product.baseName,
          );
          if (isProductBaseExist) {
            return acc;
          }
          acc.push({
            name: product.baseName,
            externalId: product.baseExternalId,
            variants: [],
          });
          return acc;
        },
        [],
      );

      products = productBaseList
        ?.map((productBase: NormalizedProductBase) => {
          const variants = data
            .filter(
              (product) => product.baseExternalId === productBase.externalId,
            )
            .map((product) => {
              return {
                sku: product.sku,
                externalId: product.variantExternalId,
                properties: {
                  name: product.variantName,
                  description: product.description,
                  price: Number(product.price),
                  weight: Number(product.weight),
                  images: product.images.map((image) => ({
                    url: image,
                  })),
                  color: this.getColor(product.sku),
                  size: this.getSize(product),
                },
              };
            });
          return {
            ...productBase,
            variants,
          };
        })
        .filter((product) => product.variants.length > 0);
    } catch (error) {
      throw new InternalServerErrorException(
        'Не вдалося нормалізувати дані з Prom.ua',
        {
          cause: error,
        },
      );
    }

    if (!products) {
      throw new InternalServerErrorException('Товарів для імпорту не знайдено');
    }

    return { products };
  }

  private getColor(sku: string): NormalizedProductColor {
    const color = getColorBaseOnSku(sku);
    return color !== undefined
      ? productColorsMap.get(color)!
      : productColorsMap.get(ProductColor.Undefined)!;
  }

  private getSize(product: PromProductXls): NormalizedProductSize {
    const { packageHeight, packageWidth, packageDepth } = product;
    const { size } = getDataBaseOnSku(product.sku);
    const name = product.variantName;

    const packageSize = {
      packageHeight: packageHeight ? Number(packageHeight) : undefined,
      packageWidth: packageWidth ? Number(packageWidth) : undefined,
      packageDepth: packageDepth ? Number(packageDepth) : undefined,
    };

    if (
      name.toLowerCase().includes('вінок') ||
      name.toLowerCase().includes('венок')
    ) {
      return {
        diameter: Number(size),
        ...packageSize,
      };
    }

    return {
      height: Number(size),
      width: product.width ? Number(product.width) : undefined,
      ...packageSize,
    };
  }
}
