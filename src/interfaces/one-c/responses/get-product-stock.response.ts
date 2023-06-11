export interface GetProductsStockResponseData {
  article: string;
  amount: number;
}

export class GetProductsStockResponse {
  sku: string;
  stock: number;

  constructor(data: GetProductsStockResponseData) {
    this.sku = data.article;
    this.stock = data.amount;
  }
}
