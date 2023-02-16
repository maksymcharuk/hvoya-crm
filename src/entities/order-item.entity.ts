import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { ProductPropertiesEntity } from './product-properties.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('order_item')
export class OrderItemEntity extends BaseEntity {
  @Column()
  quantity: number;

  @ManyToOne(() => ProductVariantEntity)
  product: ProductVariantEntity;

  @ManyToOne(() => ProductPropertiesEntity)
  productProperties: ProductPropertiesEntity;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;
}
