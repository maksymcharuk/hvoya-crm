import { Column, Entity, ManyToOne } from 'typeorm';

import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
import { ProductBaseEntity } from './product-base.entity';

@Entity('product_variant')
export class ProductVariantEntity extends BaseEntity {
  @Column({ unique: true })
  sku: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  size: string;

  @Column()
  color: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  price: number;

  @Column()
  availableItemCount: number;

  @Column("text", {
    array: true,
    nullable: true
  })
  imageIds: string[];

  @ManyToOne(() => ProductBaseEntity, (productBase) => productBase.variants)
  baseProduct: ProductBaseEntity;
}
