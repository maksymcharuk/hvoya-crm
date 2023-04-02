import { BaseEntity } from './base.entity';

export class Faq extends BaseEntity {
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;

  constructor(data?: Faq) {
    super(data);
    this.question = data?.question || '';
    this.answer = data?.answer || '';
    this.order = data?.order || 0;
    this.isPublished =
      data?.isPublished !== undefined ? data.isPublished : false;
  }
}
