import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export class Post extends BaseEntity {
  body: string;
  isPublished: boolean;
  createdBy: User | null;
  updatedBy: User | null;

  constructor(data?: Post) {
    super(data);
    this.body = data?.body || '';
    this.isPublished =
      data?.isPublished !== undefined ? data.isPublished : false;
    this.createdBy = data?.createdBy ? new User(data?.createdBy) : null;
    this.updatedBy = data?.updatedBy ? new User(data?.updatedBy) : null;
  }
}
