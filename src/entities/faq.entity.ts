import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('faq')
export class FaqEntity extends BaseEntity {
  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  order: number;

  @Column({ default: false })
  isPublished: boolean;
}
