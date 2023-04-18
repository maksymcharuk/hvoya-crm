import * as bcrypt from 'bcrypt';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { Role } from '../enums/role.enum';
import { BalanceEntity } from './balance.entity';
import { BaseEntity } from './base.entity';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  middleName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({
    default: '',
    nullable: true,
  })
  phoneNumber: string;

  @Column({ default: '' })
  location: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  cardNumber: string;

  @Column({ default: '' })
  cardholderName: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({
    default: false,
  })
  emailConfirmed: boolean;

  @Column({
    default: false,
  })
  userConfirmed: boolean;

  @Column({
    default: false,
  })
  userFreezed: boolean;

  @Column({
    update: false,
    unique: true,
    nullable: true,
  })
  accountNumber: string;

  @Column({
    default: false,
    update: false,
  })
  userTest: boolean;

  @OneToOne(() => CartEntity, (cart) => cart.owner)
  @JoinColumn()
  cart: CartEntity;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];

  @OneToOne(() => BalanceEntity, (balance) => balance.owner)
  @JoinColumn()
  balance: BalanceEntity;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
