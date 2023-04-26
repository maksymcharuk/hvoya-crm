import { BaseEntity } from './base.entity';

export class NotificationEntity extends BaseEntity {
  message: string;
  url: string;
  checked: boolean;

  constructor(data?: NotificationEntity) {
    super(data);
    this.message = data?.message || '';
    this.url = data?.url || '';
    this.checked = data?.checked || false;
  }
}
