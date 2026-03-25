import Decimal from 'decimal.js';

import { AnalyticsDateRangeDto } from './analytics-date-range.dto';

/**
 * DTO for querying orders analytics
 */
export class OrdersAnalyticsQueryDto extends AnalyticsDateRangeDto {}

/**
 * Summary statistics for all orders
 */
export class OrdersSummaryDto {
  totalOrdersCount: number;
  totalRevenue: Decimal;
  averageOrderValue: Decimal;
  averageProcessingTime: number; // in hours
  completedOrdersCount: number;
  inProgressCount: number; // Processing + TransferedToDelivery
  cancelledOrdersCount: number;
  refundedOrdersCount: number;
  refusedOrdersCount: number;
}

/**
 * Monthly aggregation of orders
 */
export class OrdersByMonthDto {
  month: string; // YYYY-MM format
  ordersCount: number;
  totalAmount: Decimal;
  processedCount: number;
  returnedCount: number;
  averageOrderValue: Decimal;
}

/**
 * Orders grouped by status
 */
export class OrdersByStatusDto {
  status: string;
  count: number;
  percentage: number;
  totalRevenue: Decimal;
}

/**
 * Orders funnel data showing conversion at each stage
 */
export class OrdersFunnelDto {
  created: number;    // all orders in period
  inProgress: number; // currently Processing or TransferedToDelivery
  fulfilled: number;  // completed (Fulfilled)
  returned: number;   // has a return request
}

/**
 * Response for orders summary endpoint
 */
export class OrdersSummaryResponseDto {
  summary: OrdersSummaryDto;
  funnel: OrdersFunnelDto;
}

/**
 * Response for orders by month endpoint
 */
export class OrdersByMonthResponseDto {
  data: OrdersByMonthDto[];
}

/**
 * Response for orders by status endpoint
 */
export class OrdersByStatusResponseDto {
  data: OrdersByStatusDto[];
}
