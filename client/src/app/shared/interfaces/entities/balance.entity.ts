import { BaseEntity } from './base.entity';

export class Balance extends BaseEntity {
  value?: number;
  info?: string;

  constructor(data?: Balance) {
    super(data);
    this.value = data?.value;
    this.info = data?.info;
  }
}
