import { Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseEntity } from './base.entity';
import { Role } from '../enums/role.enum';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  firstName: string;

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

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
