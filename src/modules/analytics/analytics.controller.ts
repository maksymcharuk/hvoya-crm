import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { AnalyticsPageOptionsDto } from '@dtos/analytics/analytics-page-options.dto';
import { DroppershipsAnalyticsQueryDto } from '@dtos/analytics/dropshippers-analytics.dto';
import { OrdersAnalyticsForAdminsPageOptionsDto } from '@dtos/analytics/orders-analytics-for-admins-page-options.dto';
import { OrdersAnalyticsQueryDto } from '@dtos/analytics/orders-analytics.dto';
import { ProductsAnalyticsQueryDto } from '@dtos/analytics/products-analytics.dto';
import { UsersAnalyticsForAdminsPageOptionsDto } from '@dtos/analytics/users-analytics-for-admins-page-options.dto';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { AnalyticsService } from './services/analytics.service';

@Controller('analytics')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * LEGACY ENDPOINTS - Kept for backward compatibility
   */

  @Get('admins/users')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getUserDataForAdmins(
    @Query()
    usersAnalyticsForAdminsPageOptionsDto: UsersAnalyticsForAdminsPageOptionsDto,
  ) {
    return this.analyticsService.getUserDataForAdmins(
      usersAnalyticsForAdminsPageOptionsDto,
    );
  }

  @Get('admins/orders')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getOrderDataForAdmins(
    @User('id') currentUserId: string,
    @Query()
    ordersAnalyticsForAdminsPageOptionsDto: OrdersAnalyticsForAdminsPageOptionsDto,
  ) {
    return this.analyticsService.getOrderDataForAdmins(
      currentUserId,
      ordersAnalyticsForAdminsPageOptionsDto,
    );
  }

  /**
   * NEW ANALYTICS ENDPOINTS
   */

  /**
   * Get analytics for all dropshippers with sales metrics
   * @query from - Optional start date (YYYY-MM-DD)
   * @query to - Optional end date (YYYY-MM-DD)
   * @query page - Page number (default: 1)
   * @query take - Items per page (default: 10)
   * @query orderBy - Field to sort by (default: createdAt)
   * @query order - Sort order: ASC or DESC (default: DESC)
   */
  @Get('admin/dropshippers')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getDropshippersAnalytics(
    @Query() query: DroppershipsAnalyticsQueryDto,
    @Query() pageOptions: AnalyticsPageOptionsDto,
  ) {
    return this.analyticsService.getDropshippersAnalytics(query, pageOptions);
  }

  /**
   * Get comprehensive order statistics summary
   * @query from - Optional start date (YYYY-MM-DD)
   * @query to - Optional end date (YYYY-MM-DD)
   */
  @Get('admin/orders/summary')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getOrdersSummary(@Query() query: OrdersAnalyticsQueryDto) {
    return this.analyticsService.getOrdersSummary(query);
  }

  /**
   * Get orders aggregated by month
   * @query from - Optional start date (YYYY-MM-DD)
   * @query to - Optional end date (YYYY-MM-DD)
   * @query page - Page number (default: 1)
   * @query take - Items per page (default: 10)
   */
  @Get('admin/orders/by-month')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getOrdersByMonth(
    @Query() query: OrdersAnalyticsQueryDto,
    @Query() pageOptions: AnalyticsPageOptionsDto,
  ) {
    return this.analyticsService.getOrdersByMonth(query, pageOptions);
  }

  /**
   * Get orders grouped by status
   * @query from - Optional start date (YYYY-MM-DD)
   * @query to - Optional end date (YYYY-MM-DD)
   */
  @Get('admin/orders/by-status')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getOrdersByStatus(@Query() query: OrdersAnalyticsQueryDto) {
    return this.analyticsService.getOrdersByStatus(query);
  }

  /**
   * Get analytics for all products with sales metrics
   * @query from - Optional start date (YYYY-MM-DD)
   * @query to - Optional end date (YYYY-MM-DD)
   * @query page - Page number (default: 1)
   * @query take - Items per page (default: 10)
   * @query orderBy - Field to sort by (default: createdAt)
   * @query order - Sort order: ASC or DESC (default: DESC)
   */
  @Get('admin/products')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getProductsAnalytics(
    @Query() query: ProductsAnalyticsQueryDto,
    @Query() pageOptions: AnalyticsPageOptionsDto,
  ) {
    return this.analyticsService.getProductsAnalytics(query, pageOptions);
  }

  /**
   * Get product timeline showing price and order count over time
   * @param productId - The product ID
   * @query from - Optional start date (YYYY-MM-DD)
   * @query to - Optional end date (YYYY-MM-DD)
   */
  @Get('admin/products/:productId/timeline')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getProductTimeline(
    @Param('productId') productId: string,
    @Query() query: ProductsAnalyticsQueryDto,
  ) {
    return this.analyticsService.getProductTimeline(productId, query);
  }
}
