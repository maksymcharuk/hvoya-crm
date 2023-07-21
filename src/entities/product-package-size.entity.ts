import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductPropertiesEntity } from './product-properties.entity';

@Entity('product_package_size')
export class ProductPackageSizeEntity extends BaseEntity {
  @Column({ default: 0 })
  height: number;

  @Column({ default: 0 })
  width: number;

  @Column({ default: 0 })
  depth: number;

  @OneToMany(() => ProductPropertiesEntity, (product) => product.size)
  products: ProductPropertiesEntity[];
}
