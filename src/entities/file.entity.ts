import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('file')
export class FileEntity extends BaseEntity {
  @Column({ nullable: true })
  public_id: string;

  @Column()
  url: string;
}
