import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductBaseEntity } from './product-base.entity';

@Entity('product_category')
export class ProductCategoryEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', array: true, default: [] })
  externalIds: string[];

  @OneToMany(() => ProductBaseEntity, (productBase) => productBase.category)
  products: ProductBaseEntity[];
}
