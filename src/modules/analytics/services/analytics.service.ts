import Decimal from 'decimal.js';
import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { OrderEntity } from '@entities/order.entity';
import { UserEntity } from '@entities/user.entity';
import { OrderStatus } from '@enums/order-status.enum';
import { Role } from '@enums/role.enum';
import { AdminAnalyticsResponse } from '@interfaces/analytics/admin-analytics.response';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import {
  AppAbility,
  CaslAbilityFactory,
} from '@modules/casl/casl-ability/casl-ability.factory';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async getAnalyticDataForAdmins(
    currentUserId: string,
  ): Promise<AdminAnalyticsResponse> {
    const currentUser = await this.dataSource.manager.findOneByOrFail(
      UserEntity,
      { id: currentUserId },
    );
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    return {
      usersData: await this.getUsersData(ability),
      ordersData: await this.getOrdersData(ability),
    };
  }

  private async getUsersData(ability: AppAbility) {
    const users = await this.dataSource.manager.find(UserEntity, {
      where: { role: Role.User },
      relations: ['balance', 'orders'],
    });

    return users
      .map((user) => {
        const orders = user.orders.filter(this.byFulfieldAndActiveOrders);
        const ordersTotal = orders.reduce(this.sumOrdersTotal, new Decimal(0));
        const maxOrder = orders.reduce((acc, order) => {
          if (!acc) return order;
          if (order.total.greaterThan(acc.total)) {
            return order;
          }
          return acc;
        }, orders[0]);

        return {
          user: sanitizeEntity<UserEntity>(ability, user),
          ordersCount: orders.length,
          ordersTotal: ordersTotal,
          maxOrder: maxOrder && sanitizeEntity<OrderEntity>(ability, maxOrder),
          netWorth: user.balance.amount.plus(ordersTotal),
        };
      })
      .sort((a, b) => b.netWorth.minus(a.netWorth).toNumber());
  }

  private async getOrdersData(ability: AppAbility) {
    const orders = await this.dataSource.manager.find(OrderEntity);
    return orders.map((order) => sanitizeEntity<OrderEntity>(ability, order));
  }

  private byFulfieldAndActiveOrders(order: OrderEntity) {
    return ![OrderStatus.Cancelled, OrderStatus.Refunded].includes(
      order.currentStatus,
    );
  }

  private sumOrdersTotal(acc: Decimal, order: OrderEntity) {
    return acc.plus(order.total);
  }
}
