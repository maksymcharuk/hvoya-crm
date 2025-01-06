import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { UsersAnalyticsForAdminsPageOptionsDto } from '@dtos/users-analytics-for-admins-page-options.dto';
import { UserEntity } from '@entities/user.entity';
import { OrderStatus } from '@enums/order-status.enum';
import { Role } from '@enums/role.enum';
import { PageMeta } from '@interfaces/page-meta.interface';
import { Page } from '@interfaces/page.interface';

import { UserData } from '../types';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  async getUsersForAdmins(
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

  // private async getUsersData(ability: AppAbility) {
  //   const users = await this.dataSource.manager.find(UserEntity, {
  //     where: { role: Role.User },
  //     relations: ['balance', 'orders'],
  //   });

  //   return users
  //     .map((user) => {
  //       const orders = user.orders.filter(this.byFulfieldAndActiveOrders);
  //       const ordersTotal = orders.reduce(this.sumOrdersTotal, new Decimal(0));
  //       const maxOrder = orders.reduce((acc, order) => {
  //         if (!acc) return order;
  //         if (order.total.greaterThan(acc.total)) {
  //           return order;
  //         }
  //         return acc;
  //       }, orders[0]);

  //       return {
  //         user: sanitizeEntity<UserEntity>(ability, user),
  //         ordersCount: orders.length,
  //         ordersTotal: ordersTotal,
  //         maxOrder: maxOrder && sanitizeEntity<OrderEntity>(ability, maxOrder),
  //         netWorth: user.balance.amount.plus(ordersTotal),
  //       };
  //     })
  //     .sort((a, b) => b.netWorth.minus(a.netWorth).toNumber());
  // }

  // private async getOrdersData(ability: AppAbility) {
  //   const orders = await this.dataSource.manager.find(OrderEntity);
  //   return orders.map((order) => sanitizeEntity<OrderEntity>(ability, order));
  // }

  // private byFulfieldAndActiveOrders(order: OrderEntity) {
  //   return ![OrderStatus.Cancelled, OrderStatus.Refunded].includes(
  //     order.currentStatus,
  //   );
  // }

  // private sumOrdersTotal(acc: Decimal, order: OrderEntity) {
  //   return acc.plus(order.total);
  // }
}
