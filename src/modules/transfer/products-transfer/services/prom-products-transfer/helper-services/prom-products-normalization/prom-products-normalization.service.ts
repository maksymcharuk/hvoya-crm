import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ProductColor } from '../../../../enums/product-color.enum';
import {
  NormalizedProductBase,
  NormalizedProductColor,
  NormalizedProductsData,
} from '../../../../interfaces/normalized-products-data.interface';
import {
  PromCategory,
  PromOffer,
  PromProducts,
} from '../../../../interfaces/prom-products.interface';
import { productColorsMap } from '../../../../maps/product-colors.map';
import { BaseNormalizationService } from '../../../base-normalization/base-normalization.service';

@Injectable()
export class PromProductsNormalizationService
  implements BaseNormalizationService<PromProducts>
{
  private readonly promColorsMap = new Map<
    string,
    NormalizedProductColor | undefined
  >([
    ['Зеленый', productColorsMap.get(ProductColor.Green)],
    ['Зелёный', productColorsMap.get(ProductColor.Green)],
    ['Белый', productColorsMap.get(ProductColor.White)],
    ['Голубой', productColorsMap.get(ProductColor.Blue)],
    ['Заснеженная', productColorsMap.get(ProductColor.Snowy)],
    ['Заснеженый', productColorsMap.get(ProductColor.Snowy)],
    ['Заснеженный', productColorsMap.get(ProductColor.Snowy)],
    ['Белый|Зеленый', productColorsMap.get(ProductColor.WhiteGreen)],
    ['Зеленый|Белый', productColorsMap.get(ProductColor.WhiteGreen)],
    ['Белый кончик|Зеленый', productColorsMap.get(ProductColor.WhiteGreen)],
    [
      'Белый кончик|Темно-зеленый',
      productColorsMap.get(ProductColor.WhiteGreen),
    ],
    [
      'Белый|Зеленый|Голубой',
      productColorsMap.get(ProductColor.WhiteGreenBlue),
    ],
  ]);

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
                color: this.getColor(offer.param),
                size: {
                  height: this.getDimension(offer.param, 'Высота'),
                  width: this.getDimension(
                    offer.param,
                    'Диаметр нижнего яруса',
                    true,
                  ),
                  diameter: this.getDimension(offer.param, 'Диаметр', true),
                },
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

  // Known issues (TODO):
  // 1. A lot of product with wrong dimensions or without dimensions at all (especially garlands)
  // 2. Some products use height instead of diameter
  // 3. None of the products have package dimensions
  private getDimension(
    params: PromOffer['param'],
    key: string,
    matchFull: boolean = false,
  ): number {
    const dimensionParam = params.find((param: PromOffer['param'][0]) =>
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

  getColor(params: PromOffer['param']): NormalizedProductColor {
    const color = params.find((param: PromOffer['param'][0]) =>
      param.$.name.includes('Цвет'),
    )?._;

    if (!color) {
      return productColorsMap.get(ProductColor.Undefined)!;
    }

    return (
      this.promColorsMap.get(color) ||
      productColorsMap.get(ProductColor.Undefined)!
    );
  }
}
