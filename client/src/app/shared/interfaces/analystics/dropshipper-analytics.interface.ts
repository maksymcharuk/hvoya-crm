export interface DropshipperAnalytics {
  dropshipperId: string;
  name: string;
  email: string;
  ordersCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  returnedAmount: number;
  returnRate: number;
  walletBalance: number;
  lastOrderDate: Date | null;
  lifetimeValue: number;
}
