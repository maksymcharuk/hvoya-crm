import { BaseEntity } from './base-entity.interface';
import { File } from './file.interface';
import { ProductProperties, ProductVariant } from './products';

export interface OrderDelivery extends BaseEntity {
  trackingId: string;
  deliveryType: string;
  city: string;
  postOffice: string;
  waybill: File;
}

export interface OrderItem extends BaseEntity {
  product: ProductVariant;
  productProperties: ProductProperties;
  quantity: number;
}

export interface Order extends BaseEntity {
  items: OrderItem[];
  delivery: OrderDelivery;
  total: number;
}
