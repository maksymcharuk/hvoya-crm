import Decimal from 'decimal.js';

import { AnalyticsDateRangeDto } from './analytics-date-range.dto';

/**
 * DTO for querying products analytics
 */
export class ProductsAnalyticsQueryDto extends AnalyticsDateRangeDto {}

/**
 * Response DTO for individual product analytics
 */
export class ProductAnalyticsDto {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: Decimal;
  uniqueDropshippersCount: number;
  returnRate: number; // percentage
  averagePrice: Decimal;
  minPrice: Decimal;
  maxPrice: Decimal;
}

/**
 * Paginated response for products analytics
 */
export class ProductsAnalyticsPageDto {
  data: ProductAnalyticsDto[];
  meta: {
    itemCount: number;
    pageCount: number;
    page: number;
    take: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

/**
 * Timeline data point for product price and orders history
 */
export class ProductTimelinePointDto {
  date: string; // YYYY-MM-DD format
  price: Decimal;
  ordersCount: number;
}

/**
 * Response for product timeline endpoint
 */
export class ProductTimelineResponseDto {
  productId: string;
  productName: string;
  timeline: ProductTimelinePointDto[];
}
