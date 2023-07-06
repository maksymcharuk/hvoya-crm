import { OrderEntity } from '@entities/order.entity';
import { UserEntity } from '@entities/user.entity';

export type NotificationData = UserEntity | OrderEntity | null;
