import { ProductColor } from '../../../enums/product-color.enum';
import { NormalizedProductColor } from '../../../interfaces/normalized-products-data.interface';
import { productColorsMap } from '../../../maps/product-colors.map';

export const promColorsMap = new Map<
  string,
  NormalizedProductColor | undefined
>([
  ['Зеленый', productColorsMap.get(ProductColor.Green)],
  ['Зелёный', productColorsMap.get(ProductColor.Green)],
  ['Белый', productColorsMap.get(ProductColor.White)],
  ['Голубой', productColorsMap.get(ProductColor.Blue)],
  ['Заснеженная', productColorsMap.get(ProductColor.GreenSnowy)],
  ['Заснеженый', productColorsMap.get(ProductColor.GreenSnowy)],
  ['Заснеженный', productColorsMap.get(ProductColor.GreenSnowy)],
  ['Белый|Зеленый', productColorsMap.get(ProductColor.GreenWhite)],
  ['Зеленый|Белый', productColorsMap.get(ProductColor.GreenWhite)],
  ['Белый кончик|Зеленый', productColorsMap.get(ProductColor.GreenWhite)],
  ['Белый кончик|Темно-зеленый', productColorsMap.get(ProductColor.GreenWhite)],
  ['Белый|Зеленый|Голубой', productColorsMap.get(ProductColor.WhiteGreenBlue)],
]);
