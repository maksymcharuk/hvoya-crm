import Decimal from 'decimal.js';

export interface ProductData {
  sku: string;
  quantity: number;
  price: Decimal;
}

export class Product {
  article: string;
  amount: number;
  price: number;

  constructor(data: ProductData) {
    this.article = data.sku;
    this.amount = data.quantity;
    this.price = data.price.toNumber();
  }
}
