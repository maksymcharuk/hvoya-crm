import Decimal from 'decimal.js';

import { AnalyticsDateRangeDto } from './analytics-date-range.dto';

/**
 * DTO for querying dropshippers analytics with optional date range
 */
export class DroppershipsAnalyticsQueryDto extends AnalyticsDateRangeDto {}

/**
 * Response DTO for individual dropshipper analytics
 */
export class DropshipperAnalyticsDto {
  dropshipperId: string;
  name: string;
  email: string;
  ordersCount: number;
  totalRevenue: Decimal;
  averageOrderValue: Decimal;
  returnedAmount: Decimal;
  returnRate: number; // percentage
  walletBalance: Decimal;
  lastOrderDate: Date | null;
  lifetimeValue: Decimal;
}

/**
 * Paginated response for dropshippers analytics
 */
export class DroppershipsAnalyticsPageDto {
  data: DropshipperAnalyticsDto[];
  meta: {
    itemCount: number;
    pageCount: number;
    page: number;
    take: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
