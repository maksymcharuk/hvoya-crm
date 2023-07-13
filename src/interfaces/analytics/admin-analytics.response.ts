import Decimal from 'decimal.js';

import { OrderEntity } from '@entities/order.entity';
import { UserEntity } from '@entities/user.entity';

export interface AdminAnalyticsUserData {
  user: UserEntity;
  ordersCount: number;
  ordersTotal: Decimal;
  maxOrder?: OrderEntity;
  netWorth: Decimal;
}

export interface AdminAnalyticsResponse {
  usersData: AdminAnalyticsUserData[];
  ordersData: OrderEntity[];
}
