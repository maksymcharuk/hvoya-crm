import { NotificationType } from '@shared/enums/notification-type.enum';

import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { User } from './user.entity';

export class NotificationEntity extends BaseEntity {
  message: string;
  data: Order | User | null;
  checked: boolean;
  type: NotificationType;

  constructor(data?: NotificationEntity) {
    super(data);
    this.message = data?.message || '';
    this.data = data?.data ? this.dataToEntity(data) : null;
    this.checked = data?.checked || false;
    this.type = data?.type || NotificationType.Info;
  }

  private dataToEntity(data: NotificationEntity): Order | User {
    if (data.type === NotificationType.Order) {
      return new Order(data?.data as Order);
    }
    return new User(data?.data as User);
  }
}
