import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseEntity } from './base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, default: '' })
  firstName: string;

  @Column({ nullable: true, default: '' })
  lastName: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
