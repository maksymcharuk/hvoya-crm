import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductPropertiesEntity } from './product-properties.entity';

@Entity('product_size')
export class ProductSizeEntity extends BaseEntity {
  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'int', nullable: true })
  width: number | null;

  @Column({ type: 'int', nullable: true })
  depth: number | null;

  @Column({ type: 'int', nullable: true })
  diameter: number | null;

  @Column({ type: 'int' })
  packageHeight: number;

  @Column({ type: 'int' })
  packageWidth: number;

  @Column({ type: 'int' })
  packageDepth: number;

  @OneToMany(() => ProductPropertiesEntity, (product) => product.size)
  products: ProductPropertiesEntity[];
}
