import { ProductColor } from '@modules/transfer/products-transfer/enums/product-color.enum';
import { skuColorsMap } from '@modules/transfer/products-transfer/maps/sku-color.map';

export function getDataBaseOnSku(sku: string) {
  const skuParts = sku.split('/');
  const color = skuParts[skuParts.length - 1];
  const size = skuParts[1];
  const skuWithoutColorAndSize = skuParts.slice(0, -2).join('-');

  return {
    color,
    size,
    skuWithoutColorAndSize,
  };
}

export function getColorBaseOnSku(sku: string): ProductColor | undefined {
  const skuData = getDataBaseOnSku(sku);

  if (!skuData.color) {
    return;
  }

  return skuColorsMap.get(skuData.color);
}
