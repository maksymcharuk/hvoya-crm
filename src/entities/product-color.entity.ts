import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductPropertiesEntity } from './product-properties.entity';

@Entity('product_color')
export class ProductColorEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  hex: string;

  @OneToMany(() => ProductPropertiesEntity, (product) => product.color)
  products: ProductPropertiesEntity[];
}
