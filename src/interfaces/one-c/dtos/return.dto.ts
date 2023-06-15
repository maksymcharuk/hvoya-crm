import { Product, ProductData } from '../shared/product';

export interface ReturnDtoData {
  companyId?: string;
  userId: string;
  orderId: string;
  items: ProductData[];
  createdAt: Date;
}

export class ReturnDto {
  id_company?: string;
  id_counterparty: string;
  id_order: string;
  list_products: Product[];
  date: string; // '2023-05-29T14:06:07'

  constructor(data: ReturnDtoData) {
    this.id_company = data.companyId;
    this.id_counterparty = data.userId;
    this.id_order = data.orderId;
    this.list_products = data.items.map((item) => new Product(item));
    this.date = data.createdAt.toISOString();
  }
}
