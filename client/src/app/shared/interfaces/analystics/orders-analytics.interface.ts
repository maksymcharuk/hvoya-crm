export interface OrdersSummary {
  totalOrdersCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  averageProcessingTime: number;
  completedOrdersCount: number;
  cancelledOrdersCount: number;
  refundedOrdersCount: number;
  refusedOrdersCount: number;
}

export interface OrdersFunnel {
  created: number;
  paid: number;
  processed: number;
  returned: number;
}

export interface OrdersSummaryResponse {
  summary: OrdersSummary;
  funnel: OrdersFunnel;
}

export interface OrdersByMonthData {
  month: string;
  ordersCount: number;
  revenue: number;
  processedCount: number;
  returnedCount: number;
}

export interface OrdersByStatusData {
  status: string;
  count: number;
  percentage: number;
  revenue: number;
}
