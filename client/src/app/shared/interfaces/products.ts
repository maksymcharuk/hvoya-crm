import { File } from './file.interface';

export interface ProductProperties {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  color: string;
  images: File[];
}

export interface ProductVariant {
  id: number;
  sku: string;
  properties: ProductProperties;
  availableItemCount: number;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductBase {
  id: number;
  name: string;
  category: ProductCategory;
  variants: ProductVariant[];
}

export interface ProductBaseForCreation {
  id: number;
  name: string;
  category: ProductCategory;
}
