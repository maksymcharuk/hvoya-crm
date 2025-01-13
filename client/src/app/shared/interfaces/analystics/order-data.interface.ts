import { Order } from '../entities/order.entity';

export interface OrderData {
  completedOrders: Order[];
  failedOrders: Order[];
}
