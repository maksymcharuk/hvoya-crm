import { NormalizedProductsData } from '../../interfaces/normalized-products-data.interface';

export abstract class BaseNormalizationService<T> {
  abstract normalize(data: T): NormalizedProductsData;
}
