export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  size: string;
  color: string;
  availableItemCount: number;
  images: { url: string }[];
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
