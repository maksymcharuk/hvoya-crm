import { ProductSize, ProductVariant } from '@shared/interfaces/products';

import { getUniqueObjectsByKey } from './get-unique-objects-by-key.util';

export function getUniqueProductSizes(arr: ProductVariant[]): ProductSize[] {
  const allSizes = arr.map((variant) => variant.properties.size);
  let result: ProductSize[] = [];

  if (allSizes.length > 0 && allSizes[0]?.diameter) {
    result = getUniqueObjectsByKey(allSizes, 'diameter');
  } else {
    result = getUniqueObjectsByKey(allSizes, 'height');
  }

  return result;
}
