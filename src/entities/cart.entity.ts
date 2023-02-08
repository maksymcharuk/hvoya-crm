import Decimal from 'decimal.js';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
import { CartItemEntity } from './cart-item.entity';
import { UserEntity } from './user.entity';

@Entity('cart')
export class CartEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  total: Decimal;

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  items: CartItemEntity[];

  @OneToOne(() => UserEntity, (user) => user.cart)
  owner: UserEntity;
}
