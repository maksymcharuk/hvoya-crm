export interface PromProductXls {
  baseExternalId: string;
  baseName: string;
  variantExternalId: string;
  variantName: string;
  sku: string;
  stock: number;
  description: string;
  price: string;
  height: string;
  width: string;
  diameter: string;
  packageHeight: string;
  packageWidth: string;
  packageDepth: string;
  weight: string;
  images: string[];
  color: string;
  size: string;
}

export type PromProductsXls = PromProductXls[];
