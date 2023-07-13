import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';

export interface AdminAnalyticsUserData {
  user: User;
  ordersCount: number;
  ordersTotal: number;
  maxOrder?: Order;
  netWorth: number;
}

export interface AdminAnalyticsResponse {
  usersData: AdminAnalyticsUserData[];
  ordersData: Order[];
}
