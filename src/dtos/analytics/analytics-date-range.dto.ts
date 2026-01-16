import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

/**
 * Base DTO for analytics with optional date range filtering
 * Supports custom date ranges for flexible analytics queries
 */
export class AnalyticsDateRangeDto {
  @IsOptional()
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;
    return new Date(value);
  })
  readonly from?: Date;

  @IsOptional()
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;
    return new Date(value);
  })
  readonly to?: Date;

  /**
   * Get date range tuple, using provided dates or all-time range
   */
  getDateRange(): [Date, Date] {
    const to = this.to || new Date();
    const from = this.from || new Date(0);
    return [from, to];
  }
}
