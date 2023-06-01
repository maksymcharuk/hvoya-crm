import { NotificationType } from '@shared/enums/notification-type.enum';

import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

export class NotificationEntity extends BaseEntity {
  message: string;
  data: Order;
  checked: boolean;
  type: NotificationType;

  constructor(data?: NotificationEntity) {
    super(data);
    this.message = data?.message || '';
    this.data = data?.data || new Order();
    this.checked = data?.checked || false;
    this.type = data?.type || NotificationType.Info;
  }
}
