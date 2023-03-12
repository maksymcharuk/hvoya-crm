import { BaseEntity } from './base-entity.interface';
import { File } from './file.interface';

export interface ProductColor extends BaseEntity {
  name: string;
  hex: string;
}

export interface ProductSize extends BaseEntity {
  height: number;
  width?: number | null;
  depth?: number | null;
  diameter?: number | null;
  packageHeight: number;
  packageWidth: number;
  packageDepth: number;
}

interface ProductBaseWithOutRelations extends BaseEntity {
  name: string;
}

export interface ProductProperties extends BaseEntity {
  name: string;
  description: string;
  price: number;
  size: ProductSize;
  color: ProductColor;
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
