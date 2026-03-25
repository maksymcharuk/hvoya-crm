import Decimal from 'decimal.js';
import { DataSource } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';

import { AnalyticsPageOptionsDto } from '@dtos/analytics/analytics-page-options.dto';
import {
  DroppershipsAnalyticsPageDto,
  DroppershipsAnalyticsQueryDto,
  DropshipperAnalyticsDto,
} from '@dtos/analytics/dropshippers-analytics.dto';
import {
  OrdersByMonthResponseDto,
  OrdersByStatusResponseDto,
  OrdersFunnelDto,
  OrdersSummaryDto,
  OrdersSummaryResponseDto,
} from '@dtos/analytics/orders-analytics.dto';
import {
  ProductAnalyticsDto,
  ProductTimelineResponseDto,
  ProductsAnalyticsPageDto,
} from '@dtos/analytics/products-analytics.dto';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderEntity } from '@entities/order.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { UserEntity } from '@entities/user.entity';
import { OrderStatus } from '@enums/order-status.enum';
import { Role } from '@enums/role.enum';
import { PageMeta } from '@interfaces/page-meta.interface';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Get analytics for all dropshippers with optional date range filtering
   * Returns aggregated metrics per dropshipper
   */
  async getDropshippersAnalytics(
    query: DroppershipsAnalyticsQueryDto,
    pageOptions: AnalyticsPageOptionsDto,
  ): Promise<DroppershipsAnalyticsPageDto> {
    const [fromDate, toDate] = query.getDateRange();

    // Get dropshippers with their order aggregations
    const dropshippersQuery = this.dataSource.manager
      .createQueryBuilder(UserEntity, 'user')
      .select('"user"."id"', 'dropshipperId')
      .addSelect('CONCAT("user"."firstName", \' \', "user"."lastName")', 'name')
      .addSelect('"user"."email"', 'email')
      .addSelect('COUNT(DISTINCT "order"."id")', 'ordersCount')
      .addSelect('COALESCE(SUM("order"."total"), 0)', 'totalRevenue')
      .addSelect(
        'COALESCE(SUM("order"."total"), 0) / NULLIF(COUNT(DISTINCT "order"."id"), 0)',
        'averageOrderValue',
      )
      .addSelect('COALESCE(SUM("returnRequest"."total"), 0)', 'returnedAmount')
      .addSelect('"balance"."amount"', 'walletBalance')
      .addSelect('MAX("order"."createdAt")', 'lastOrderDate')
      .addSelect('COALESCE(SUM("order"."total"), 0)', 'lifetimeValue')
      .leftJoin('user.orders', 'order')
      .leftJoin('order.returnRequest', 'returnRequest')
      .leftJoin('user.balance', 'balance')
      .where('"user"."role" = :role', { role: Role.User })
      .andWhere('"order"."currentStatus" NOT IN (:...excludedStatuses)', {
        excludedStatuses: [OrderStatus.Cancelled, OrderStatus.Refused],
      })
      .andWhere('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .groupBy('"user"."id"')
      .addGroupBy('"user"."email"')
      .addGroupBy('"user"."firstName"')
      .addGroupBy('"user"."lastName"')
      .addGroupBy('"balance"."amount"');

    // Apply sorting
    if (pageOptions.orderBy) {
      dropshippersQuery.addOrderBy(
        `"${pageOptions.orderBy}"`,
        pageOptions.order,
      );
    } else {
      dropshippersQuery.addOrderBy('"totalRevenue"', 'DESC');
    }

    // Get total count for pagination
    const countQuery = this.dataSource.manager
      .createQueryBuilder(UserEntity, 'user')
      .select('COUNT(DISTINCT "user"."id")', 'count')
      .leftJoin('user.orders', 'order')
      .leftJoin('order.returnRequest', 'returnRequest')
      .where('"user"."role" = :role', { role: Role.User })
      .andWhere('"order"."currentStatus" NOT IN (:...excludedStatuses)', {
        excludedStatuses: [OrderStatus.Cancelled, OrderStatus.Refused],
      })
      .andWhere('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    const countResult = await countQuery.getRawOne<{ count: string }>();
    const itemCount = parseInt(countResult?.count ?? '0', 10) || 0;

    // Apply pagination
    dropshippersQuery.offset(pageOptions.skip).limit(pageOptions.take);

    const rawData = await dropshippersQuery.getRawMany<any>();

    // Transform raw query results to DTOs
    const data: DropshipperAnalyticsDto[] = rawData.map((row) => ({
      dropshipperId: row.dropshipperId,
      name: row.name || '',
      email: row.email || '',
      ordersCount: parseInt(row.ordersCount, 10) || 0,
      totalRevenue: new Decimal(row.totalRevenue || 0),
      averageOrderValue: new Decimal(row.averageOrderValue || 0),
      returnedAmount: new Decimal(row.returnedAmount || 0),
      returnRate: this.calculateReturnRate(
        parseInt(row.ordersCount, 10) || 0,
        new Decimal(row.returnedAmount || 0),
        new Decimal(row.totalRevenue || 0),
      ),
      walletBalance: new Decimal(row.walletBalance || 0),
      lastOrderDate: row.lastOrderDate ? new Date(row.lastOrderDate) : null,
      lifetimeValue: new Decimal(row.lifetimeValue || 0),
    }));

    const pageMetaDto = new PageMeta({
      itemCount,
      pageOptionsDto: {
        page: pageOptions.page ?? 1,
        take: pageOptions.take ?? 10,
        skip: pageOptions.skip,
        orderBy: pageOptions.orderBy,
      } as any,
    });

    return {
      data,
      meta: {
        itemCount,
        pageCount: pageMetaDto.pageCount,
        page: pageMetaDto.page,
        take: pageMetaDto.take,
        hasPreviousPage: pageMetaDto.hasPreviousPage,
        hasNextPage: pageMetaDto.hasNextPage,
      },
    };
  }

  /**
   * Get comprehensive order statistics summary
   */
  async getOrdersSummary(query: any): Promise<OrdersSummaryResponseDto> {
    const [fromDate, toDate] = query.getDateRange?.() || [
      new Date(0),
      new Date(),
    ];

    // Get summary statistics
    const summaryData = await this.dataSource.manager
      .createQueryBuilder(OrderEntity, 'order')
      .select('COUNT("order"."id")', 'totalOrdersCount')
      .addSelect('COALESCE(SUM("order"."total"), 0)', 'totalRevenue')
      .addSelect('COALESCE(AVG("order"."total"), 0)', 'averageOrderValue')
      .addSelect(
        'COALESCE(EXTRACT(EPOCH FROM AVG("status"."createdAt" - "order"."createdAt")) / 3600, 0)',
        'averageProcessingTime',
      )
      .leftJoin('order.statuses', 'status')
      .where('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .andWhere('"status"."status" = :processedStatus', {
        processedStatus: OrderStatus.Fulfilled,
      })
      .getRawOne<any>();

    // Get counts by status
    const statusCounts = await this.dataSource.manager
      .createQueryBuilder(OrderEntity, 'order')
      .select('"order"."currentStatus"', 'status')
      .addSelect('COUNT("order"."id")', 'count')
      .where('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .groupBy('"order"."currentStatus"')
      .getRawMany<any>();

    const statusMap = new Map(
      statusCounts.map((s) => [s.status, parseInt(s.count, 10)]),
    );

    const summary: OrdersSummaryDto = {
      totalOrdersCount: parseInt(summaryData.totalOrdersCount, 10) || 0,
      totalRevenue: new Decimal(summaryData.totalRevenue || 0),
      averageOrderValue: new Decimal(summaryData.averageOrderValue || 0),
      averageProcessingTime: Math.round(
        parseFloat(summaryData.averageProcessingTime) || 0,
      ),
      completedOrdersCount: statusMap.get(OrderStatus.Fulfilled) || 0,
      cancelledOrdersCount: statusMap.get(OrderStatus.Cancelled) || 0,
      refundedOrdersCount: statusMap.get(OrderStatus.Refunded) || 0,
      refusedOrdersCount: statusMap.get(OrderStatus.Refused) || 0,
    };

    // Calculate funnel
    const totalOrders = summary.totalOrdersCount;
    const paidOrders =
      summary.completedOrdersCount + summary.cancelledOrdersCount;

    const funnel: OrdersFunnelDto = {
      created: totalOrders,
      paid: paidOrders,
      processed: summary.completedOrdersCount,
      returned: await this.getReturnedOrdersCount(fromDate, toDate),
    };

    return { summary, funnel };
  }

  /**
   * Get orders aggregated by month
   */
  async getOrdersByMonth(
    query: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _pageOptions: AnalyticsPageOptionsDto,
  ): Promise<OrdersByMonthResponseDto> {
    const [fromDate, toDate] = query.getDateRange?.() || [
      new Date(0),
      new Date(),
    ];

    const data = await this.dataSource.manager
      .createQueryBuilder(OrderEntity, 'order')
      .select('TO_CHAR("order"."createdAt", \'YYYY-MM\')', 'month')
      .addSelect('COUNT("order"."id")', 'ordersCount')
      .addSelect('COALESCE(SUM("order"."total"), 0)', 'totalAmount')
      .addSelect(
        'SUM(CASE WHEN "order"."currentStatus" = :fulfilled THEN 1 ELSE 0 END)',
        'processedCount',
      )
      .addSelect(
        'SUM(CASE WHEN "returnRequest"."id" IS NOT NULL THEN 1 ELSE 0 END)',
        'returnedCount',
      )
      .addSelect('COALESCE(AVG("order"."total"), 0)', 'averageOrderValue')
      .leftJoin('order.returnRequest', 'returnRequest')
      .where('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .groupBy('TO_CHAR("order"."createdAt", \'YYYY-MM\')')
      .orderBy('month', 'ASC')
      .setParameters({ fulfilled: OrderStatus.Fulfilled })
      .getRawMany<any>();

    return {
      data: data.map((row) => ({
        month: row.month,
        ordersCount: parseInt(row.ordersCount, 10) || 0,
        totalAmount: new Decimal(row.totalAmount || 0),
        processedCount: parseInt(row.processedCount, 10) || 0,
        returnedCount: parseInt(row.returnedCount, 10) || 0,
        averageOrderValue: new Decimal(row.averageOrderValue || 0),
      })),
    };
  }

  /**
   * Get orders aggregated by status
   */
  async getOrdersByStatus(query: any): Promise<OrdersByStatusResponseDto> {
    const [fromDate, toDate] = query.getDateRange?.() || [
      new Date(0),
      new Date(),
    ];

    const totalOrders = await this.dataSource.manager
      .createQueryBuilder(OrderEntity, 'order')
      .select('COUNT("order"."id")', 'count')
      .where('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .getRawOne<{ count: string }>();

    const totalCount = parseInt(totalOrders?.count ?? '1', 10) || 1;

    const statusData = await this.dataSource.manager
      .createQueryBuilder(OrderEntity, 'order')
      .select('"order"."currentStatus"', 'status')
      .addSelect('COUNT("order"."id")', 'count')
      .addSelect('COALESCE(SUM("order"."total"), 0)', 'totalRevenue')
      .where('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .groupBy('"order"."currentStatus"')
      .setParameters({ fromDate, toDate })
      .getRawMany<any>();

    return {
      data: statusData.map((row) => ({
        status: row.status,
        count: parseInt(row.count, 10) || 0,
        percentage: parseFloat(
          ((parseInt(row.count, 10) / totalCount) * 100).toFixed(2),
        ),
        totalRevenue: new Decimal(row.totalRevenue || 0),
      })),
    };
  }

  /**
   * Get analytics for all products with sales metrics
   *
   * Correctly calculates price statistics by getting all ProductPropertiesEntity
   * for each ProductVariantEntity. Each property represents a point in the product's
   * price history, so we aggregate across all properties to get min/avg/max prices.
   */
  async getProductsAnalytics(
    query: any,
    pageOptions: AnalyticsPageOptionsDto,
  ): Promise<ProductsAnalyticsPageDto> {
    const [fromDate, toDate] = query.getDateRange?.() || [
      new Date(0),
      new Date(),
    ];

    // Subquery to calculate price statistics from all properties for each variant
    // This aggregates ALL ProductPropertiesEntity for each ProductVariantEntity
    const priceStatsSubquery = this.dataSource.manager
      .createQueryBuilder()
      .select('"price"."productId"', 'variantId')
      .addSelect('AVG("price"."price"::NUMERIC)', 'avgPrice')
      .addSelect('MIN("price"."price"::NUMERIC)', 'minPrice')
      .addSelect('MAX("price"."price"::NUMERIC)', 'maxPrice')
      .addSelect('MAX("price"."name")', 'productName')
      .addSelect('COUNT("price"."id")', 'propertyCount')
      .from('product_properties', 'price')
      .groupBy('"price"."productId"')
      .getQuery();

    const productsQuery = this.dataSource.manager
      .createQueryBuilder(ProductVariantEntity, 'variant')
      .select('"variant"."id"', 'productId')
      .addSelect('"priceStats"."productName"', 'productName')
      .addSelect('COALESCE(SUM("item"."quantity"), 0)', 'quantitySold')
      .addSelect('COALESCE(SUM("order"."total"), 0)', 'totalRevenue')
      .addSelect(
        'COUNT(DISTINCT "order"."customerId")',
        'uniqueDropshippersCount',
      )
      .addSelect('COALESCE("priceStats"."avgPrice", 0)', 'averagePrice')
      .addSelect('COALESCE("priceStats"."minPrice", 0)', 'minPrice')
      .addSelect('COALESCE("priceStats"."maxPrice", 0)', 'maxPrice')
      .leftJoin(
        `(${priceStatsSubquery})`,
        'priceStats',
        '"priceStats"."variantId" = "variant"."id"',
      )
      .leftJoin(OrderItemEntity, 'item', '"item"."productId" = "variant"."id"')
      .leftJoin(OrderEntity, 'order', '"order"."id" = "item"."orderId"')
      .where('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .andWhere('"order"."currentStatus" != :cancelled', {
        cancelled: OrderStatus.Cancelled,
      })
      .groupBy('"variant"."id"')
      .addGroupBy('"priceStats"."productName"')
      .addGroupBy('"priceStats"."avgPrice"')
      .addGroupBy('"priceStats"."minPrice"')
      .addGroupBy('"priceStats"."maxPrice"');

    // Apply sorting
    if (pageOptions.orderBy) {
      productsQuery.addOrderBy(`"${pageOptions.orderBy}"`, pageOptions.order);
    } else {
      productsQuery.addOrderBy('"totalRevenue"', 'DESC');
    }

    // Get count
    const countQuery = this.dataSource.manager
      .createQueryBuilder(ProductVariantEntity, 'variant')
      .select('COUNT(DISTINCT "variant"."id")', 'count')
      .leftJoin(OrderItemEntity, 'item', '"item"."productId" = "variant"."id"')
      .leftJoin(OrderEntity, 'order', '"order"."id" = "item"."orderId"')
      .where('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });

    const countResult = await countQuery.getRawOne<{ count: string }>();
    const itemCount = parseInt(countResult?.count ?? '0', 10) || 0;

    // Apply pagination
    productsQuery.offset(pageOptions.skip).limit(pageOptions.take);

    const rawData = await productsQuery.getRawMany<any>();

    const data: ProductAnalyticsDto[] = rawData.map((row) => {
      const quantitySold = parseInt(row.quantitySold, 10) || 0;
      const totalRevenue = new Decimal(row.totalRevenue || 0);

      return {
        productId: row.productId,
        productName: row.productName || 'Unknown',
        quantitySold,
        totalRevenue,
        uniqueDropshippersCount: parseInt(row.uniqueDropshippersCount, 10) || 0,
        returnRate: 0, // Will be calculated if needed
        averagePrice: new Decimal(row.averagePrice || 0),
        minPrice: new Decimal(row.minPrice || 0),
        maxPrice: new Decimal(row.maxPrice || 0),
      };
    });

    const pageMetaDto = new PageMeta({
      itemCount,
      pageOptionsDto: {
        page: pageOptions.page ?? 1,
        take: pageOptions.take ?? 10,
        skip: pageOptions.skip,
        orderBy: pageOptions.orderBy,
      } as any,
    });

    return {
      data,
      meta: {
        itemCount,
        pageCount: pageMetaDto.pageCount,
        page: pageMetaDto.page,
        take: pageMetaDto.take,
        hasPreviousPage: pageMetaDto.hasPreviousPage,
        hasNextPage: pageMetaDto.hasNextPage,
      },
    };
  }

  /**
   * Get product timeline showing price and order count over time
   */
  async getProductTimeline(
    productId: string,
    query: any,
  ): Promise<ProductTimelineResponseDto> {
    const [fromDate, toDate] = query.getDateRange?.() || [
      new Date(0),
      new Date(),
    ];

    // Get product info
    const product = (await this.dataSource.manager.findOne(
      ProductVariantEntity,
      {
        where: { id: productId },
        relations: ['baseProduct', 'properties'],
      },
    )) as ProductVariantEntity | null;

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Get timeline data - price and orders by date
    const timelineData = await this.dataSource.manager
      .createQueryBuilder(OrderItemEntity, 'item')
      .select('DATE("order"."createdAt")', 'date')
      .addSelect('COALESCE(AVG("properties"."price"), 0)', 'price')
      .addSelect('COALESCE(COUNT("item"."id"), 0)', 'ordersCount')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .leftJoin('item.productProperties', 'properties')
      .where('"item"."productId" = :productId', { productId })
      .andWhere('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .groupBy('DATE("order"."createdAt")')
      .orderBy('DATE("order"."createdAt")', 'ASC')
      .getRawMany<any>();

    return {
      productId,
      productName: (product.baseProduct as any)?.name || 'Unknown',
      timeline: timelineData.map((row) => ({
        date: row.date,
        price: new Decimal(row.price || 0),
        ordersCount: parseInt(row.ordersCount, 10) || 0,
      })),
    };
  }

  /**
   * Helper method to calculate return rate percentage
   */
  private calculateReturnRate(
    ordersCount: number,
    returnedAmount: Decimal,
    totalRevenue: Decimal,
  ): number {
    if (ordersCount === 0 || totalRevenue.isZero()) {
      return 0;
    }
    return parseFloat(
      returnedAmount.dividedBy(totalRevenue).times(100).toFixed(2),
    );
  }

  /**
   * Helper method to get count of returned orders
   */
  private async getReturnedOrdersCount(
    fromDate: Date,
    toDate: Date,
  ): Promise<number> {
    const result = await this.dataSource.manager
      .createQueryBuilder(OrderEntity, 'order')
      .select('COUNT("order"."id")', 'count')
      .leftJoin('order.returnRequest', 'returnRequest')
      .where('"order"."createdAt" BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .andWhere('"returnRequest"."id" IS NOT NULL')
      .getRawOne<{ count: string }>();

    return parseInt(result?.count ?? '0', 10) || 0;
  }
}
