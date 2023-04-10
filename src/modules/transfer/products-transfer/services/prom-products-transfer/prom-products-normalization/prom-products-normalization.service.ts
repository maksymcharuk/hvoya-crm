import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ProductColor } from '../../../enums/product-color.enum';
import {
  NormalizedProductBase,
  NormalizedProductColor,
  NormalizedProductSize,
  NormalizedProductsData,
} from '../../../interfaces/normalized-products-data.interface';
import {
  PromCategory,
  PromOffer,
  PromProducts,
} from '../../../interfaces/prom-products.interface';
import { productColorsMap } from '../../../maps/product-colors.map';
import { skuColorsMap } from '../../../maps/sku-color.map';
import { BaseNormalizationService } from '../../base-normalization/base-normalization.service';
import { promColorsMap } from '../maps/prom-colors.map';

@Injectable()
export class PromProductsNormalizationService
  implements BaseNormalizationService<PromProducts>
{
  normalize(data: PromProducts): NormalizedProductsData {
    let products: NormalizedProductBase[] | undefined = [];
    try {
      const categories = data.yml_catalog.shop[0]?.categories[0]?.category
        .filter((category: PromCategory) => category.$.parentId === undefined)
        .map((category: PromCategory) => {
          return {
            name: category._.trim(),
            externalId: category.$.id,
          };
        });
      const productBaseList =
        data.yml_catalog.shop[0]?.categories[0]?.category.filter(
          (category: PromCategory) => category.$.parentId !== undefined,
        );
      products = productBaseList
        ?.map((productBase: PromCategory) => ({
          name: productBase._.trim(),
          externalId: productBase.$.id,
          category: categories?.find(
            (category) => category.externalId === productBase.$.parentId,
          ),
          variants: data.yml_catalog.shop[0]!.offers[0]!.offer.filter(
            (offer: PromOffer) => offer.categoryId[0] === productBase.$.id,
          ).map((offer: PromOffer) => {
            return {
              sku: offer.vendorCode[0]!.trim(),
              externalId: offer.$.id,
              properties: {
                name: offer.name_ua[0]!,
                description: offer.description_ua[0]!,
                price: Number(offer.price[0]),
                weight: this.getWeight(offer.param),
                images: offer.picture.map((picture: string) => ({
                  url: picture,
                })),
                color: this.getColor(offer),
                size: this.getSize(offer),
              },
            };
          }),
        }))
        .filter((product) => product?.variants?.length);
    } catch (error) {
      throw new HttpException(
        'Не вдалося нормалізувати дані з Prom.ua',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!products) {
      throw new HttpException(
        'Товарів для імпорту не знайдено',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { products };
  }

  private getWeight(params: PromOffer['param']): number | undefined {
    const weightParam = params.find((param: PromOffer['param'][0]) =>
      param.$.name.includes('Вес'),
    );

    if (!weightParam) {
      return;
    }

    return Number(weightParam._);
  }

  private getSize(offer: PromOffer): NormalizedProductSize {
    const sku = offer.vendorCode[0]?.trim();
    // Fetch size from sku first
    if (sku) {
      const { size } = this.getDataBaseOnSku(sku);
      if (
        offer.name_ua[0]!.includes('вінок') ||
        offer.name_ua[0]!.includes('Вінок')
      ) {
        return {
          height: 0,
          width: 0,
          diameter: Number(size),
        };
      }
      return {
        height: Number(size),
        width: Number(size),
        diameter: 0,
      };
    }

    return {
      height: this.getDimension(offer.param, 'Высота'),
      width: this.getDimension(offer.param, 'Диаметр нижнего яруса', true),
      diameter: this.getDimension(offer.param, 'Диаметр', true),
    };
  }

  // Known issues (TODO):
  // 1. A lot of product with wrong dimensions or without dimensions at all (especially garlands)
  // 2. Some products use height instead of diameter
  // 3. None of the products have package dimensions
  private getDimension(
    param: PromOffer['param'],
    key: string,
    matchFull: boolean = false,
  ): number {
    const dimensionParam = param.find((param: PromOffer['param'][0]) =>
      matchFull ? param.$.name === key : param.$.name.includes(key),
    );

    if (!dimensionParam) {
      return 0;
    }

    if (dimensionParam.$.unit === 'м' || dimensionParam._.includes('.')) {
      return Math.round(Number(dimensionParam._) * 100);
    }

    return Number(dimensionParam._);
  }

  private getColor(offer: PromOffer): NormalizedProductColor {
    const sku = offer.vendorCode[0]?.trim();
    // Fetch color from sku first
    if (sku) {
      const { color } = this.getDataBaseOnSku(sku);
      const colorFromSku = color ? skuColorsMap.get(color) : undefined;
      if (colorFromSku) {
        return (
          productColorsMap.get(colorFromSku) ||
          productColorsMap.get(ProductColor.Undefined)!
        );
      }
    }

    const color = offer.param.find((param: PromOffer['param'][0]) =>
      param.$.name.includes('Цвет'),
    )?._;

    if (!color) {
      return productColorsMap.get(ProductColor.Undefined)!;
    }

    return (
      promColorsMap.get(color) || productColorsMap.get(ProductColor.Undefined)!
    );
  }

  private getDataBaseOnSku(sku: string) {
    const skuParts = sku.split('/');
    const color = skuParts[skuParts.length - 1];
    const size = skuParts[skuParts.length - 2];
    const skuWithoutColorAndSize = skuParts.slice(0, -2).join('-');

    return {
      color,
      size,
      skuWithoutColorAndSize,
    };
  }
}
