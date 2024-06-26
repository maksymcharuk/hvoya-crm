import { Injectable } from '@angular/core';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  MatchConditions,
  PureAbility,
} from '@casl/ability';

import {
  RETURNABLE_ORDER_STATUSES,
  UPDATABLE_ORDER_STATUSES,
} from '@shared/constants/order.constants';
import { FundsWithdrawalRequestStatus } from '@shared/enums/funds-withdrawal-request-status.enum';
import { OrderReturnRequestStatus } from '@shared/enums/order-return-request-status.enum';
import { OrderStatus } from '@shared/enums/order-status.enum';
import { Role } from '@shared/enums/role.enum';
import {
  Actions,
  AppAbility,
  Subjects,
} from '@shared/interfaces/casl.interface';
import { Faq } from '@shared/interfaces/entities/faq.entity';
import { FundsWithdrawalRequest } from '@shared/interfaces/entities/funds-withdrawal-request.entity';
import { OrderReturnRequest } from '@shared/interfaces/entities/order-return-request.entity';
import { Order } from '@shared/interfaces/entities/order.entity';
import { Post } from '@shared/interfaces/entities/post.entity';
import { User } from '@shared/interfaces/entities/user.entity';
import { AdminPage } from '@shared/interfaces/pages/admin-page.entity';
import { DashboardPage } from '@shared/interfaces/pages/dashboard-page.entity';

import { UserService } from './user.service';

const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable({
  providedIn: 'root',
})
export class PoliciesService {
  constructor(private userService: UserService) {}

  update(appAbility: AppAbility) {
    const rules = this.build()?.rules;
    if (rules) {
      appAbility.update(rules);
    }
  }

  build() {
    const currentUser = this.userService.getUser();
    const { can, build } = new AbilityBuilder<PureAbility<[Actions, Subjects]>>(
      PureAbility as AbilityClass<AppAbility>,
    );

    const buildAbilities = () =>
      build({
        detectSubjectType: (item) =>
          item.constructor as ExtractSubjectType<Subjects>,
        conditionsMatcher: lambdaMatcher as any,
      });

    if (!currentUser) {
      return buildAbilities();
    }

    switch (currentUser.role) {
      case Role.SuperAdmin:
        can('visit', AdminPage);
        can(['read', 'create'], User);
        can(
          'delete',
          User,
          (user: User) =>
            user.role === Role.User &&
            !user.orders?.length &&
            !user.balance?.paymentTransactions?.length,
        );
        can('update', User, (user: User) => user.role !== Role.SuperAdmin);
        can(['create', 'update'], Faq);
        can('update', Order, (order: Order) =>
          UPDATABLE_ORDER_STATUSES.includes(order.currentStatus),
        );
        can(
          ['approve', 'update'],
          OrderReturnRequest,
          (orderReturnRequest: OrderReturnRequest) =>
            orderReturnRequest.status === OrderReturnRequestStatus.Pending,
        );
        can(
          'approve',
          FundsWithdrawalRequest,
          (fundsWithdrawalRequest: FundsWithdrawalRequest) =>
            fundsWithdrawalRequest.status ===
            FundsWithdrawalRequestStatus.Pending,
        );
        can(['read', 'create', 'update', 'delete'], Post);
        break;
      case Role.Admin:
        can('visit', AdminPage);
        can('read', User);
        can('update', User, (user: User) => user.role === Role.User);
        can(['create', 'update'], Faq);
        can('update', Order, (order: Order) =>
          UPDATABLE_ORDER_STATUSES.includes(order.currentStatus),
        );
        can(
          ['approve', 'update'],
          OrderReturnRequest,
          (orderReturnRequest: OrderReturnRequest) =>
            orderReturnRequest.status === OrderReturnRequestStatus.Pending,
        );
        can(['read', 'create', 'update', 'delete'], Post);
        break;
      case Role.User:
        can('visit', DashboardPage);
        can('read', User, (user: User) => user.id === currentUser.id);
        can(
          ['update', 'cancel'],
          Order,
          (order: Order) => order.currentStatus === OrderStatus.Pending,
        );
        can(
          'return',
          Order,
          (order: Order) =>
            !order.returnRequest &&
            RETURNABLE_ORDER_STATUSES.includes(order.currentStatus),
        );
        can('create', OrderReturnRequest);
        can(
          ['update'],
          OrderReturnRequest,
          (orderReturnRequest: OrderReturnRequest) =>
            orderReturnRequest.status === OrderReturnRequestStatus.Pending,
        );
        can('read', Post);
        break;
    }

    return buildAbilities();
  }
}
