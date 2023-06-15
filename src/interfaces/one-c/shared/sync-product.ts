export interface SyncProductData {
  article: string;
  amount: number;
  price: number | '_';
}

export class SyncProduct {
  sku: string;
  stock: number;
  price?: number;

  constructor(data: SyncProductData) {
    this.sku = data.article;
    this.stock = data.amount;
    this.price = data.price === '_' ? undefined : data.price;
  }
}
