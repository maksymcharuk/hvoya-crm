import { OrderDeliveryStatus } from '@shared/enums/order-delivery-status.enum';
import { OrderStatus } from '@shared/enums/order-status.enum';

import { BaseEntity } from './base-entity.interface';
import { File } from './file.interface';
import { ProductProperties, ProductVariant } from './products';

export interface OrderDelivery extends BaseEntity {
  trackingId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  deliveryType: string;
  status: OrderDeliveryStatus;
  city: string;
  postOffice: string;
  waybill: File | null;
}

export interface OrderItem extends BaseEntity {
  product: ProductVariant;
  productProperties: ProductProperties;
  quantity: number;
}

export interface Order extends BaseEntity {
  items: OrderItem[];
  delivery: OrderDelivery;
  status: OrderStatus;
  total: number;
}
