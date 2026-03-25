export interface OrdersSummary {
  totalOrdersCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  averageProcessingTime: number;
  completedOrdersCount: number;
  inProgressCount: number;
  cancelledOrdersCount: number;
  refundedOrdersCount: number;
  refusedOrdersCount: number;
}

export interface OrdersFunnel {
  created: number;
  inProgress: number;
  fulfilled: number;
  returned: number;
}

export interface OrdersSummaryResponse {
  summary: OrdersSummary;
  funnel: OrdersFunnel;
}

export interface OrdersByMonthData {
  month: string;
  ordersCount: number;
  revenueAmount: number;
  processedCount: number;
  returnedCount: number;
  averageOrderValue: number;
}

export interface OrdersByStatusData {
  status: string;
  count: number;
  percentage: number;
  revenue: number;
}
