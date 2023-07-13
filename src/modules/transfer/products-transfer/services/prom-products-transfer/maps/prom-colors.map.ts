import { ProductColor } from '../../../enums/product-color.enum';

export const promColorsMap = new Map<string, ProductColor>([
  ['Зеленый', ProductColor.Green],
  ['Зелёный', ProductColor.Green],
  ['Зеленый|Темно-зеленый', ProductColor.Green],
  ['Зеленый|Светло-зеленый', ProductColor.GreenLight],
  ['Белый', ProductColor.White],
  ['Голубой', ProductColor.Blue],
  ['Заснеженная', ProductColor.GreenSnowy],
  ['Заснеженый', ProductColor.GreenSnowy],
  ['Заснеженный', ProductColor.GreenSnowy],
  ['Белый|Зеленый', ProductColor.GreenWhite],
  ['Зеленый|Белый', ProductColor.GreenWhite],
  ['Белый кончик|Зеленый', ProductColor.GreenWhite],
  ['Белый кончик|Темно-зеленый', ProductColor.GreenWhite],
  ['Белый|Зеленый|Голубой', ProductColor.WhiteGreenBlue],
]);
