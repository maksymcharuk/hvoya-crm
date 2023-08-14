import { OrderEntity } from '@entities/order.entity';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';

export type NotificationData = UserEntity | OrderEntity | RequestEntity | null;
