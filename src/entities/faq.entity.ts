import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('faq')
export class FaqEntity extends BaseEntity {
  @Column()
  question: string;

  @Column()
  answer: string;

  @Column({ unique: true })
  order: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: false })
  isArchived: boolean;
}
