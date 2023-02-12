import Decimal from 'decimal.js';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('product_properties')
export class ProductPropertiesEntity extends BaseEntity {
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
  price: Decimal;

  @ManyToMany(() => FileEntity, {
    eager: true,
  })
  @JoinTable()
  images: FileEntity[];

  @ManyToOne(
    () => ProductVariantEntity,
    (productVariant) => productVariant.properties,
  )
  product: ProductVariantEntity;
}
