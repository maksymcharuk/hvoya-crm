import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ProductColor } from '../../../enums/product-color.enum';
import {
  NormalizedProductBase,
  NormalizedProductColor,
  NormalizedProductSize,
  NormalizedProductsData,
} from '../../../interfaces/normalized-products-data.interface';
import {
  PromCategoryXml,
  PromOfferParamXml,
  PromOfferXml,
  PromProductsXml,
} from '../../../interfaces/prom-products-xml.interface';
import { productColorsMap } from '../../../maps/product-colors.map';
import { BaseNormalizationService } from '../../base-normalization/base-normalization.service';
import { promColorsMap } from '../maps/prom-colors.map';
import {
  getColorBaseOnSku,
  getDataBaseOnSku,
} from '../utils/products-normalization.util';

@Injectable()
export class PromProductsNormalizationServiceXml
  implements BaseNormalizationService<PromProductsXml>
{
  normalize(data: PromProductsXml): NormalizedProductsData {
    let products: NormalizedProductBase[] | undefined = [];
    try {
      const promCategoriesXml =
        data.yml_catalog.shop[0]?.categories[0]?.category;

      if (!promCategoriesXml) {
        throw new HttpException(
          'Товарів для імпорту не знайдено',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const categories = promCategoriesXml.map((category: PromCategoryXml) => {
        return {
          name: category._.trim(),
          externalId: category.$.id,
        };
      });
      const productBaseList = this.getBaseProducts(promCategoriesXml);
      products = productBaseList
        ?.map((productBase: PromCategoryXml) => ({
          name: productBase._.trim(),
          externalId: productBase.$.id,
          category: categories?.find(
            (category) => category.externalId === productBase.$.parentId,
          ),
          variants: data.yml_catalog.shop[0]!.offers[0]!.offer.filter(
            (offer: PromOfferXml) => offer.categoryId[0] === productBase.$.id,
          ).map((offer: PromOfferXml) => {
            return {
              sku: offer.vendorCode[0]!.trim(),
              externalId: offer.$.id,
              properties: {
                name: offer.name_ua?.[0] || offer.name[0]!,
                description: offer.description_ua?.[0] || offer.description[0]!,
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

  private getBaseProducts(categories: PromCategoryXml[]): PromCategoryXml[] {
    const baseProducts = categories.filter(
      (category: PromCategoryXml) =>
        category.$.parentId !== undefined ||
        !categories.some((c) => c.$.parentId === category.$.id),
    );

    return baseProducts;
  }

  private getWeight(
    params: PromOfferParamXml[] | undefined,
  ): number | undefined {
    if (!params) {
      return;
    }

    const weightParam = params.find(
      (param: PromOfferParamXml) => param && param.$.name.includes('Вес'),
    );

    if (!weightParam) {
      return;
    }

    return Number(weightParam._);
  }

  private getSize(offer: PromOfferXml): NormalizedProductSize {
    const sku = offer.vendorCode[0]?.trim();
    let height;
    // Fetch size from sku first
    if (sku) {
      const { size } = getDataBaseOnSku(sku);
      height = Number(size);
      const name = offer.name_ua?.[0] || offer.name[0];
      if (name!.includes('вінок') || name!.includes('Вінок')) {
        const diameter = Number(size);
        return {
          height: 0,
          width: 0,
          diameter: diameter || this.getDimension(offer.param, 'Диаметр', true),
        };
      }
    }

    const width =
      this.getDimension(offer.param, 'Диаметр нижнего яруса', true) ||
      this.getDimension(offer.param, 'Ширина', true);

    return {
      height: height || this.getDimension(offer.param, 'Высота'),
      width: width,
      diameter: 0,
    };
  }

  // Known issues (TODO):
  // 1. A lot of product with wrong dimensions or without dimensions at all (especially garlands)
  // 2. Some products use height instead of diameter
  // 3. None of the products have package dimensions
  private getDimension(
    params: PromOfferParamXml[] | undefined,
    key: string,
    matchFull: boolean = false,
  ): number {
    if (!params) {
      return 0;
    }

    const dimensionParam = params.find((param: PromOfferParamXml) =>
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

  private getColor(offer: PromOfferXml): NormalizedProductColor {
    const color =
      this.getColorBaseOnSku(offer) || this.getColorBaseOnRawColor(offer);
    return color !== undefined
      ? productColorsMap.get(color)!
      : productColorsMap.get(ProductColor.Undefined)!;
  }

  private getColorBaseOnRawColor(
    offer: PromOfferXml,
  ): ProductColor | undefined {
    if (!offer.param) {
      return;
    }

    const rawColor = offer.param
      .find((param: PromOfferParamXml) => param.$.name.includes('Цвет'))
      ?._.trim();

    if (!rawColor) {
      return;
    }

    return promColorsMap.get(rawColor);
  }

  private getColorBaseOnSku(offer: PromOfferXml): ProductColor | undefined {
    const sku = offer.vendorCode[0]?.trim();

    if (!sku) {
      return;
    }

    return getColorBaseOnSku(sku);
  }
}
