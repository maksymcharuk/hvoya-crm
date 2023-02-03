import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { CartEntity } from './cart.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('cart_item')
export class CartItemEntity extends BaseEntity {
  @Column()
  quantity: number;

  @ManyToOne(() => ProductVariantEntity)
  product: ProductVariantEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity;
}
