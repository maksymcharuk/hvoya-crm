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
    ProductColor.GreenSnowy,
    {
      name: 'Зелений|Засніжений',
      hex: '#008000, #F0F8FF',
    },
  ],
  [
    ProductColor.GreenWhite,
    {
      name: 'Зелений|Білий',
      hex: '#008000, #FFFFFF',
    },
  ],
  [
    ProductColor.GreenLight,
    {
      name: 'Світло-зелений',
      hex: '#02b902',
    },
  ],
  [
    ProductColor.GreenOlive,
    {
      name: 'Зелено-оливковий',
      hex: '#8f9c62',
    },
  ],
  [
    ProductColor.BlueSnowy,
    {
      name: 'Блакитний|Засніжений',
      hex: '#A6CAF0, #F0F8FF',
    },
  ],
  [
    ProductColor.WhiteSnowy,
    {
      name: 'Білий|Засніжений',
      hex: '#FFFFFF, #F0F8FF',
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
