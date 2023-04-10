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
  ['Заснеженная', productColorsMap.get(ProductColor.Snowy)],
  ['Заснеженый', productColorsMap.get(ProductColor.Snowy)],
  ['Заснеженный', productColorsMap.get(ProductColor.Snowy)],
  ['Белый|Зеленый', productColorsMap.get(ProductColor.WhiteGreen)],
  ['Зеленый|Белый', productColorsMap.get(ProductColor.WhiteGreen)],
  ['Белый кончик|Зеленый', productColorsMap.get(ProductColor.WhiteGreen)],
  ['Белый кончик|Темно-зеленый', productColorsMap.get(ProductColor.WhiteGreen)],
  ['Белый|Зеленый|Голубой', productColorsMap.get(ProductColor.WhiteGreenBlue)],
]);
