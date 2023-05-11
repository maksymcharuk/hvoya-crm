import { NotificationType } from '@shared/enums/notification-type.enum';

import { BaseEntity } from './base.entity';

class Data {
  id: string | null;

  constructor(data?: Data) {
    this.id = data?.id || null;
  }
}

export class NotificationEntity extends BaseEntity {
  message: string;
  data: Data;
  checked: boolean;
  type: NotificationType;

  constructor(data?: NotificationEntity) {
    super(data);
    this.message = data?.message || '';
    this.data = data?.data || new Data();
    this.checked = data?.checked || false;
    this.type = data?.type || NotificationType.Info;
  }
}
