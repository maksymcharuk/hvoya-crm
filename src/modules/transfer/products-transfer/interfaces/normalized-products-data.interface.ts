export interface NormalizedImage {
  url: string;
}

export interface NormalizedProductSize {
  height?: number;
  width?: number;
  diameter?: number;
}

export interface NormalizedProductColor {
  name: string;
  hex: string;
}

export interface NormalizedProductProperties {
  name: string;
  description: string;
  price: number;
  weight?: number;
  images: NormalizedImage[];
  color: NormalizedProductColor;
  size: NormalizedProductSize;
}

export interface NormalizedProductVariant {
  sku: string;
  stock?: number;
  externalId: string;
  properties: NormalizedProductProperties;
}

export interface NormalizedProductCategory {
  name: string;
  externalId: string;
}

export interface NormalizedProductBase {
  name: string;
  externalId: string;
  category?: NormalizedProductCategory;
  variants: NormalizedProductVariant[];
}

export interface NormalizedProductsData {
  products: NormalizedProductBase[];
}
