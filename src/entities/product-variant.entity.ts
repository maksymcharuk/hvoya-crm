import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductBaseEntity } from './product-base.entity';
import { ProductPropertiesEntity } from './product-properties.entity';

@Entity('product_variant')
export class ProductVariantEntity extends BaseEntity {
  @Column({ unique: true })
  sku: string;

  @Column({
    default: 0,
  })
  availableItemCount: number;

  @ManyToOne(() => ProductPropertiesEntity, (properties) => properties.product)
  properties: ProductPropertiesEntity;

  @ManyToOne(() => ProductBaseEntity, (productBase) => productBase.variants)
  baseProduct: ProductBaseEntity;
}
