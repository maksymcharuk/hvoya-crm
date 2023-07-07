import { ProductColor } from '../enums/product-color.enum';

export const skuColorsMap = new Map<string, ProductColor>([
  ['G', ProductColor.Green],
  ['B', ProductColor.Blue],
  ['W', ProductColor.White],
  ['GS', ProductColor.GreenSnowy],
  ['GW', ProductColor.GreenWhite],
  ['BS', ProductColor.BlueSnowy],
  ['WS', ProductColor.WhiteSnowy],
]);
