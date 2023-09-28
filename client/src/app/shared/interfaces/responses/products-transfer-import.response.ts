export interface UpsetionError {
  error: Error;
  entity: any;
}

export interface ProductsTransferImportResponse {
  created: {
    productBases: any[];
    productVariants: any[];
    productCategories: any[];
    productColors: any[];
    productSizes: any[];
    productPackageSizes: any[];
    productImages: string[];
  };
  updated: {
    productBases: any[];
    productVariants: any[];
  };
  errors: UpsetionError[];
}
