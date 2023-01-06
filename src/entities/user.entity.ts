import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseEntity } from './base.entity';
import { Role } from '@enums/role.enum';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
