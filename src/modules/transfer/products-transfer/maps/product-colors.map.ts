import { ProductColor } from '../enums/product-color.enum';
import { NormalizedProductColor } from '../interfaces/normalized-products-data.interface';

export const productColorsMap = new Map<ProductColor, NormalizedProductColor>([
  [
    ProductColor.Green,
    {
      name: 'Зелений',
      hex: '#008000',
    },
  ],
  [
    ProductColor.Blue,
    {
      name: 'Блакитний',
      hex: '#A6CAF0',
    },
  ],
  [
    ProductColor.White,
    {
      name: 'Білий',
      hex: '#FFFFFF',
    },
  ],
  [
    ProductColor.Snowy,
    {
      name: 'Засніжений',
      hex: '#F0F8FF',
    },
  ],
  [
    ProductColor.WhiteGreen,
    {
      name: 'Білий|Зелений',
      hex: '#FFFFFF, #008000',
    },
  ],
  [
    ProductColor.WhiteGreenBlue,
    {
      name: 'Білий|Зелений|Блакитний',
      hex: '#FFFFFF, #008000, #A6CAF0',
    },
  ],
  [
    ProductColor.Undefined,
    {
      name: 'Невизначений',
      hex: '#000000',
    },
  ],
]);
