import {
  NormalizedProductBase,
  NormalizedProductCategory,
  NormalizedProductColor,
  NormalizedProductSize,
  NormalizedProductVariant,
} from './normalized-products-data.interface';

type UpsertEntity =
  | NormalizedProductBase
  | NormalizedProductVariant
  | NormalizedProductCategory
  | NormalizedProductColor
  | NormalizedProductSize;

export interface UpsetionError {
  error: Error;
  entity: UpsertEntity;
}

export interface UpsertionStats {
  created: {
    productBases: NormalizedProductBase[];
    productVariants: NormalizedProductVariant[];
    productCategories: NormalizedProductCategory[];
    productColors: NormalizedProductColor[];
    productSizes: NormalizedProductSize[];
    productPackageSizes: NormalizedProductSize[];
    productImages: string[];
  };
  updated: {
    productBases: NormalizedProductBase[];
    productVariants: NormalizedProductVariant[];
  };
  errors: UpsetionError[];
}
