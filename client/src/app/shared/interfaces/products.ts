import { BaseEntity } from './base-entity.interface';
import { File } from './file.interface';

interface ProductBaseWithOutRelations extends BaseEntity {
  name: string;
}

export interface ProductProperties extends BaseEntity {
  name: string;
  description: string;
  price: number;
  size: string;
  color: string;
  images: File[];
}

export interface ProductVariant extends BaseEntity {
  sku: string;
  properties: ProductProperties;
  availableItemCount: number;
  baseProduct: ProductBaseWithOutRelations;
}

export interface ProductCategory extends BaseEntity {
  name: string;
}

export interface ProductBase extends ProductBaseWithOutRelations {
  category: ProductCategory;
  variants: ProductVariant[];
}
