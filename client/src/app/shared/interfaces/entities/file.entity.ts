import { BaseEntity } from './base.entity';

export class File extends BaseEntity {
  public_id?: string;
  url?: string;

  constructor(data?: File) {
    super(data);
    this.public_id = data?.public_id;
    this.url = data?.url;
  }
}
