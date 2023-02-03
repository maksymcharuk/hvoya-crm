import { File } from './file.interface';

export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  size: string;
  color: string;
  availableItemCount: number;
  images: File[];
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
