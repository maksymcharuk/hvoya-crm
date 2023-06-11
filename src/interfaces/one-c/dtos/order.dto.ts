import Decimal from 'decimal.js';

import { OrderStatus } from '@enums/order-status.enum';

import { getOrderStatusName } from '../maps/order-status.map';
import { Product, ProductData } from '../shared/product';

export interface OrderDtoData {
  companyId?: string;
  userId: string;
  id: string;
  number?: number;
  total?: Decimal;
  status?: OrderStatus;
  items: ProductData[];
  createdAt: Date; // '2023-05-29T14:06:07'
  description?: string;
}

export class Order {
  id_company?: string;
  id_counterparty: string;
  id_order: string;
  order_number?: string;
  order_amount?: number;
  order_status?: string;
  list_products: Product[];
  date: string; // '2023-05-29T14:06:07'
  description: string;

  constructor(data: OrderDtoData) {
    this.id_company = data.companyId;
    this.id_counterparty = data.userId;
    this.id_order = data.id;
    this.order_number = data.number?.toString();
    this.order_amount = data.total?.toNumber();
    this.order_status = getOrderStatusName(data.status);
    this.list_products = data.items.map((item) => new Product(item));
    this.date = data.createdAt.toISOString();
    this.description = data.description || '';
  }
}

export type OrderDto = Order[];
