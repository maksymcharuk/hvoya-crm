import Decimal from 'decimal.js';
import { Between, DataSource, In } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';

import { AnalyticsPageOptionsDto } from '@dtos/analytics/analytics-page-options.dto';
import {
  DroppershipsAnalyticsPageDto,
  DroppershipsAnalyticsQueryDto,
  DropshipperAnalyticsDto,
} from '@dtos/analytics/dropshippers-analytics.dto';
import { OrdersAnalyticsForAdminsPageOptionsDto } from '@dtos/analytics/orders-analytics-for-admins-page-options.dto';
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
import { UsersAnalyticsForAdminsPageOptionsDto } from '@dtos/analytics/users-analytics-for-admins-page-options.dto';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderEntity } from '@entities/order.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { UserEntity } from '@entities/user.entity';
import { OrderStatus } from '@enums/order-status.enum';
import { Role } from '@enums/role.enum';
import { PageMeta } from '@interfaces/page-meta.interface';
import { Page } from '@interfaces/page.interface';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { UsersService } from '@modules/users/services/users.service';

import { OrderData, UserData } from '../types';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async getUserDataForAdmins(
    pageOptionsDto: UsersAnalyticsForAdminsPageOptionsDto,
  ): Promise<Page<UserData>> {
    let query = this.dataSource.manager
      .createQueryBuilder(UserEntity, 'user')
      .select('user.id', 'id')
      .addSelect('user.lastName', 'lastName')
      .addSelect('user.firstName', 'firstName')
      .addSelect('user.middleName', 'middleName')
      .addSelect('COUNT(COALESCE(order.id, NULL))', 'ordersCount')
      .addSelect('SUM(COALESCE(order.total, 0))', 'ordersTotalSum')
      .addSelect('SUM(COALESCE(order.total, 0)) + balance.amount', 'netWorth');

    const baseCondition = 'order.currentStatus NOT IN (:...excludedStatuses)';
    if (pageOptionsDto.dateRangeType === 'custom' && pageOptionsDto.range) {
      const [startDate, endDate] = pageOptionsDto.range;
      query.leftJoin(
        'user.orders',
        'order',
        `${baseCondition} AND order.createdAt BETWEEN :startDate AND :endDate`,
        {
          startDate,
          endDate,
        },
      );
    } else if (pageOptionsDto.dateRangeType === 'year') {
      query.leftJoin(
        'user.orders',
        'order',
        `${baseCondition} AND EXTRACT(YEAR FROM order.createdAt) = :year`,
        { year: pageOptionsDto.year },
      );
    } else {
      query.leftJoin('user.orders', 'order', baseCondition);
    }

    query
      .leftJoin('user.balance', 'balance')
      .where('user.role = :role', { role: Role.User })
      .groupBy('user.id')
      .addGroupBy('balance.amount')
      .setParameters({
        excludedStatuses: [
          OrderStatus.Cancelled,
          OrderStatus.Refused,
          OrderStatus.Refunded,
        ],
      });

    if (pageOptionsDto.orderBy) {
      query.addOrderBy(`"${pageOptionsDto.orderBy}"`, pageOptionsDto.order);
    }

    query.offset(pageOptionsDto.skip).limit(pageOptionsDto.take);

    const itemCount = await query.getCount();
    let data = await query.getRawMany<UserData>();

    const pageMetaDto = new PageMeta({ itemCount, pageOptionsDto });

    return new Page(data, pageMetaDto);
  }

  async getOrderDataForAdmins(
    currentUserId: string,
    pageOptionsDto: OrdersAnalyticsForAdminsPageOptionsDto,
  ): Promise<OrderData> {
    const user = await this.usersService.findById(currentUserId);

    if (!user) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    const completedOrders = await this.dataSource.manager.find(OrderEntity, {
      select: ['id', 'total', 'createdAt'],
      where: {
        currentStatus: In([
          OrderStatus.Fulfilled,
          OrderStatus.Pending,
          OrderStatus.Processing,
        ]),
        createdAt: Between(pageOptionsDto.range[0], pageOptionsDto.range[1]),
      },
    });
    const failedOrders = await this.dataSource.manager.find(OrderEntity, {
      select: ['id', 'total', 'createdAt'],
      where: {
        currentStatus: In([
          OrderStatus.Cancelled,
          OrderStatus.Refunded,
          OrderStatus.Refused,
        ]),
        createdAt: Between(pageOptionsDto.range[0], pageOptionsDto.range[1]),
      },
    });

    return {
      completedOrders: completedOrders.map((order) =>
        sanitizeEntity<OrderEntity>(ability, order),
      ),
      failedOrders: failedOrders.map((order) =>
        sanitizeEntity<OrderEntity>(ability, order),
      ),
    };
  }

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
      .select('user.id', 'dropshipperId')
      .addSelect("CONCAT(user.firstName, ' ', user.lastName)", 'name')
      .addSelect('user.email', 'email')
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .addSelect('COALESCE(SUM(order.total), 0)', 'totalRevenue')
      .addSelect(
        'COALESCE(SUM(order.total), 0) / NULLIF(COUNT(DISTINCT order.id), 0)',
        'averageOrderValue',
      )
      .addSelect('COALESCE(SUM(returnRequest.total), 0)', 'returnedAmount')
      .addSelect('balance.amount', 'walletBalance')
      .addSelect('MAX(order.createdAt)', 'lastOrderDate')
      .addSelect('COALESCE(SUM(order.total), 0)', 'lifetimeValue')
      .leftJoin(
        'user.orders',
        'order',
        'order.currentStatus NOT IN (:...excludedStatuses) AND order.createdAt BETWEEN :fromDate AND :toDate',
        {
          excludedStatuses: [OrderStatus.Cancelled, OrderStatus.Refused],
          fromDate,
          toDate,
        },
      )
      .leftJoin('order.returnRequest', 'returnRequest')
      .leftJoin('user.balance', 'balance')
      .where('user.role = :role', { role: Role.User })
      .groupBy('user.id')
      .addGroupBy('user.email')
      .addGroupBy('user.firstName')
      .addGroupBy('user.lastName')
      .addGroupBy('balance.amount');

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
      .select('COUNT(DISTINCT user.id)', 'count')
      .leftJoin(
        'user.orders',
        'order',
        'order.currentStatus NOT IN (:...excludedStatuses) AND order.createdAt BETWEEN :fromDate AND :toDate',
        {
          excludedStatuses: [OrderStatus.Cancelled, OrderStatus.Refused],
          fromDate,
          toDate,
        },
      )
      .leftJoin('order.returnRequest', 'returnRequest')
      .where('user.role = :role', { role: Role.User });

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
      .select('COUNT(order.id)', 'totalOrdersCount')
      .addSelect('COALESCE(SUM(order.total), 0)', 'totalRevenue')
      .addSelect('COALESCE(AVG(order.total), 0)', 'averageOrderValue')
      .addSelect(
        'COALESCE(EXTRACT(EPOCH FROM AVG(status.createdAt - order.createdAt)) / 3600, 0)',
        'averageProcessingTime',
      )
      .where('order.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .leftJoin(
        'order.statuses',
        'status',
        'status.status = :processedStatus',
        { processedStatus: OrderStatus.Fulfilled },
      )
      .getRawOne<any>();

    // Get counts by status
    const statusCounts = await this.dataSource.manager
      .createQueryBuilder(OrderEntity, 'order')
      .select('order.currentStatus', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .where('order.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .groupBy('order.currentStatus')
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
      .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(order.id)', 'ordersCount')
      .addSelect('COALESCE(SUM(order.total), 0)', 'totalAmount')
      .addSelect(
        'SUM(CASE WHEN order.currentStatus = :fulfilled THEN 1 ELSE 0 END)',
        'processedCount',
      )
      .addSelect(
        'SUM(CASE WHEN order.returnRequest IS NOT NULL THEN 1 ELSE 0 END)',
        'returnedCount',
      )
      .addSelect('COALESCE(AVG(order.total), 0)', 'averageOrderValue')
      .where('order.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .leftJoin('order.returnRequest', 'returnRequest')
      .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM')")
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
      .select('COUNT(order.id)', 'count')
      .where('order.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .getRawOne<{ count: string }>();

    const totalCount = parseInt(totalOrders?.count ?? '1', 10) || 1;

    const statusData = await this.dataSource.manager
      .createQueryBuilder(OrderEntity, 'order')
      .select('order.currentStatus', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .addSelect('COALESCE(SUM(order.total), 0)', 'totalRevenue')
      .where('order.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .groupBy('order.currentStatus')
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
   */
  async getProductsAnalytics(
    query: any,
    pageOptions: AnalyticsPageOptionsDto,
  ): Promise<ProductsAnalyticsPageDto> {
    const [fromDate, toDate] = query.getDateRange?.() || [
      new Date(0),
      new Date(),
    ];

    const productsQuery = this.dataSource.manager
      .createQueryBuilder(ProductVariantEntity, 'variant')
      .select('variant.id', 'productId')
      .addSelect('base.name', 'productName')
      .addSelect('COALESCE(SUM(item.quantity), 0)', 'quantitySold')
      .addSelect('COALESCE(SUM(order.total), 0)', 'totalRevenue')
      .addSelect('COUNT(DISTINCT order.customer)', 'uniqueDropshippersCount')
      .addSelect('COALESCE(AVG(properties.price), 0)', 'averagePrice')
      .addSelect('COALESCE(MIN(properties.price), 0)', 'minPrice')
      .addSelect('COALESCE(MAX(properties.price), 0)', 'maxPrice')
      .leftJoin('variant.properties', 'properties')
      .leftJoin('variant.baseProduct', 'base')
      .leftJoin(OrderItemEntity, 'item', 'item.productId = variant.id')
      .leftJoin(
        'item.order',
        'order',
        'order.createdAt BETWEEN :fromDate AND :toDate AND order.currentStatus != :cancelled',
        { fromDate, toDate, cancelled: OrderStatus.Cancelled },
      )
      .groupBy('variant.id')
      .addGroupBy('base.name');

    // Apply sorting
    if (pageOptions.orderBy) {
      productsQuery.addOrderBy(`"${pageOptions.orderBy}"`, pageOptions.order);
    } else {
      productsQuery.addOrderBy('"totalRevenue"', 'DESC');
    }

    // Get count
    const countQuery = this.dataSource.manager
      .createQueryBuilder(ProductVariantEntity, 'variant')
      .select('COUNT(DISTINCT variant.id)', 'count')
      .leftJoin('variant.properties', 'properties')
      .leftJoin('variant.baseProduct', 'base')
      .leftJoin(OrderItemEntity, 'item', 'item.productId = variant.id')
      .leftJoin(
        'item.order',
        'order',
        'order.createdAt BETWEEN :fromDate AND :toDate',
        { fromDate, toDate },
      )
      .setParameters({ fromDate, toDate });

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
      .select('DATE(order.createdAt)', 'date')
      .addSelect('COALESCE(AVG(properties.price), 0)', 'price')
      .addSelect('COALESCE(COUNT(item.id), 0)', 'ordersCount')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .leftJoin('item.productProperties', 'properties')
      .where('item.product.id = :productId', { productId })
      .andWhere('order.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .groupBy('DATE(order.createdAt)')
      .orderBy('DATE(order.createdAt)', 'ASC')
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
      .select('COUNT(order.id)', 'count')
      .leftJoin('order.returnRequest', 'returnRequest')
      .where(
        'order.createdAt BETWEEN :fromDate AND :toDate AND returnRequest.id IS NOT NULL',
        { fromDate, toDate },
      )
      .getRawOne<{ count: string }>();

    return parseInt(result?.count ?? '0', 10) || 0;
  }
}
