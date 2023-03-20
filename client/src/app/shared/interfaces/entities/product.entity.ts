import { BaseEntity } from './base.entity';
import { File } from './file.entity';

export class ProductColor extends BaseEntity {
  name: string;
  hex: string;

  constructor(data?: ProductColor) {
    super(data);
    this.name = data?.name || '';
    this.hex = data?.hex || '';
  }
}

export class ProductSize extends BaseEntity {
  height: number;
  width?: number | null;
  depth?: number | null;
  diameter?: number | null;
  packageHeight: number;
  packageWidth: number;
  packageDepth: number;

  constructor(data?: ProductSize) {
    super(data);
    this.height = data?.height || 0;
    this.width = data?.width;
    this.depth = data?.depth;
    this.diameter = data?.diameter;
    this.packageHeight = data?.packageHeight || 0;
    this.packageWidth = data?.packageWidth || 0;
    this.packageDepth = data?.packageDepth || 0;
  }
}

class ProductBaseWithOutRelations extends BaseEntity {
  name?: string;

  constructor(data?: ProductBaseWithOutRelations) {
    super(data);
    this.name = data?.name;
  }
}

export class ProductProperties extends BaseEntity {
  name: string;
  description: string;
  price: number;
  size: ProductSize;
  color: ProductColor;
  images: File[];

  constructor(data?: ProductProperties) {
    super(data);
    this.name = data?.name || '';
    this.description = data?.description || '';
    this.price = data?.price || 0;
    this.size = new ProductSize(data?.size);
    this.color = new ProductColor(data?.color);
    this.images = data?.images.map((image) => new File(image)) || [];
  }
}

export class ProductVariant extends BaseEntity {
  sku: string;
  properties: ProductProperties;
  availableItemCount?: number;
  baseProduct: ProductBaseWithOutRelations;

  constructor(data?: ProductVariant) {
    super(data);
    this.sku = data?.sku || '';
    this.properties = new ProductProperties(data?.properties);
    this.availableItemCount = data?.availableItemCount;
    this.baseProduct = new ProductBaseWithOutRelations(data?.baseProduct);
  }
}

export class ProductCategory extends BaseEntity {
  name?: string;

  constructor(data?: ProductCategory) {
    super(data);
    this.name = data?.name;
  }
}

export class ProductBase extends ProductBaseWithOutRelations {
  category: ProductCategory;
  variants: ProductVariant[];

  constructor(data?: ProductBase) {
    super(data);
    this.category = new ProductCategory(data?.category);
    this.variants =
      data?.variants.map((variant) => new ProductVariant(variant)) || [];
  }
}
