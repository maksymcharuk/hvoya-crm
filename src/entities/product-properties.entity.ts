import Decimal from 'decimal.js';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { DecimalTransformer } from '../transformers/decimal.transformer';
import { NumericTransformer } from '../transformers/numeric.transformer';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { ProductColorEntity } from './product-color.entity';
import { ProductPackageSizeEntity } from './product-package-size.entity';
import { ProductSizeEntity } from './product-size.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('product_properties')
export class ProductPropertiesEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  price: Decimal;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new NumericTransformer(),
  })
  weight: number;

  @Column({ default: true })
  isPublished: boolean;

  @ManyToMany(() => FileEntity, {
    eager: true,
  })
  @JoinTable()
  images: FileEntity[];

  @ManyToOne(() => ProductColorEntity, {
    eager: true,
  })
  color: ProductColorEntity;

  @ManyToOne(() => ProductSizeEntity, {
    eager: true,
  })
  size: ProductSizeEntity;

  @ManyToOne(() => ProductPackageSizeEntity, {
    eager: true,
  })
  packageSize: ProductPackageSizeEntity;

  @ManyToOne(
    () => ProductVariantEntity,
    (productVariant) => productVariant.properties,
  )
  product: ProductVariantEntity;
}
