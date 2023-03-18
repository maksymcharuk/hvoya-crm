import { BaseEntity } from './base-entity.interface';

export interface Faq extends BaseEntity {
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}
