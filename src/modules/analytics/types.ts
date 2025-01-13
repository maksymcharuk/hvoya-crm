import { OrderEntity } from '@entities/order.entity';

export interface UserData {
  id: string;
  name: string;
  ordersCount: number;
  ordersTotalSum: number;
  netWorth: number;
}

export interface OrderData {
  completedOrders: OrderEntity[];
  failedOrders: OrderEntity[];
}
