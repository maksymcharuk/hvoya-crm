import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductPropertiesEntity } from './product-properties.entity';

@Entity('product_size')
export class ProductSizeEntity extends BaseEntity {
  @Column({ default: 0 })
  height: number;

  @Column({ default: 0 })
  width: number;

  @Column({ default: 0 })
  depth: number;

  @Column({ default: 0 })
  diameter: number;

  @OneToMany(() => ProductPropertiesEntity, (product) => product.size)
  products: ProductPropertiesEntity[];
}
