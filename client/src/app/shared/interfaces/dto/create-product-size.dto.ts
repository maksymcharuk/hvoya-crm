export interface CreateProductSizeDTO {
  height: number;
  width?: number | null;
  depth?: number | null;
  diameter?: number | null;
  packageHeight: number;
  packageWidth: number;
  packageDepth: number;
}
