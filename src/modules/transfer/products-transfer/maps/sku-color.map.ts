import { ProductColor } from '../enums/product-color.enum';

export const skuColorsMap = new Map<string, ProductColor>([
  ['G', ProductColor.Green],
  ['B', ProductColor.Blue],
  ['W', ProductColor.White],
  ['GS', ProductColor.Snowy],
]);
