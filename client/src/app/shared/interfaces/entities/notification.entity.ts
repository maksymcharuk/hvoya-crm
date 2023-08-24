import {
  ORDER_NOTIFICATIONS,
  REQUEST_NOTIFICATION,
  USER_NOTIFICATION,
} from '@shared/constants/notification.constants';
import { NotificationType } from '@shared/enums/notification-type.enum';

import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { RequestEntity } from './request.entity';
import { User } from './user.entity';

export class NotificationEntity extends BaseEntity {
  message: string | null;
  data: Order | User | RequestEntity | null;
  checked: boolean;
  type: NotificationType;

  constructor(data?: NotificationEntity) {
    super(data);
    this.message = data?.message || null;
    this.data = data?.data ? this.dataToEntity(data) : null;
    this.checked = data?.checked || false;
    this.type = data?.type || NotificationType.Info;
  }

  dataIsUser(data: Order | User | RequestEntity | null): data is User {
    return data instanceof User;
  }

  dataIsOrder(data: Order | User | RequestEntity | null): data is Order {
    return data instanceof Order;
  }

  dataIsRequest(data: Order | User | RequestEntity | null): data is RequestEntity {
    return data instanceof RequestEntity;
  }

  private dataToEntity(data: NotificationEntity): Order | User | RequestEntity | null {
    switch (true) {
      case ORDER_NOTIFICATIONS.includes(data.type):
        return new Order(data?.data as Order);
      case USER_NOTIFICATION.includes(data.type):
        return new User(data?.data as User);
      case REQUEST_NOTIFICATION.includes(data.type):
        return new RequestEntity(data?.data as RequestEntity);
      default:
        return null;
    }
  }
}
