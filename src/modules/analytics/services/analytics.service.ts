import { Between, DataSource, In } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';

import { OrdersAnalyticsForAdminsPageOptionsDto } from '@dtos/analytics/orders-analytics-for-admins-page-options.dto';
import { UsersAnalyticsForAdminsPageOptionsDto } from '@dtos/analytics/users-analytics-for-admins-page-options.dto';
import { OrderEntity } from '@entities/order.entity';
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
}
