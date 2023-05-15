import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { BalanceEntity } from '@entities/balance.entity';
import { CartEntity } from '@entities/cart.entity';
import { FaqEntity } from '@entities/faq.entity';
import { NotificationEntity } from '@entities/notification.entity';
import { OrderEntity } from '@entities/order.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductColorEntity } from '@entities/product-color.entity';
import { ProductSizeEntity } from '@entities/product-size.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { Role } from '@enums/role.enum';

type Subjects =
  | InferSubjects<
      | typeof UserEntity
      | typeof ProductCategoryEntity
      | typeof ProductBaseEntity
      | typeof ProductVariantEntity
      | typeof ProductColorEntity
      | typeof ProductSizeEntity
      | typeof CartEntity
      | typeof OrderEntity
      | typeof FaqEntity
      | typeof BalanceEntity
      | typeof NotificationEntity
    >
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.role === Role.SuperAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
      can(
        [
          Action.SuperRead,
          Action.SuperCreate,
          Action.SuperUpdate,
          Action.SuperDelete,
        ],
        'all',
      ); // read-write access to everything
    }

    if (user.role === Role.Admin) {
      can([Action.Read, Action.Update], UserEntity);
      // Products
      can([Action.Read, Action.Create, Action.Update], ProductCategoryEntity);
      can([Action.Read, Action.Create, Action.Update], ProductBaseEntity);
      can([Action.Read, Action.Create, Action.Update], ProductVariantEntity);
      can([Action.Read, Action.Create, Action.Update], ProductColorEntity);
      can([Action.Read, Action.Create, Action.Update], ProductSizeEntity);
      // Orders
      can(
        [
          Action.Read,
          Action.Create,
          Action.Update,
          Action.SuperRead,
          Action.SuperUpdate,
        ],
        OrderEntity,
      );
      // FAQ
      can([Action.Read, Action.Create, Action.Update], FaqEntity);
      // Balance
      can([Action.Read, Action.Update], BalanceEntity);
      // Notifications
      can([Action.Read, Action.Create, Action.Update], NotificationEntity);
    }

    if (user.role === Role.User) {
      can([Action.Read, Action.Update], UserEntity);
      // Products
      can(Action.Read, ProductCategoryEntity);
      can(Action.Read, ProductBaseEntity);
      can(
        Action.Read,
        ProductVariantEntity,
        ({ properties }: ProductVariantEntity) => properties.isPublished,
      );
      can([Action.Read], ProductColorEntity);
      can([Action.Read], ProductSizeEntity);
      // Cart
      can([Action.Read, Action.AddTo, Action.RemoveFrom], CartEntity);
      // Orders
      can(
        [Action.Read, Action.Create],
        OrderEntity,
        ({ customer }: OrderEntity) => {
          return customer.id === user.id;
        },
      ); // can read and create only his own orders
      can([Action.Update], OrderEntity, ({ customer, status }: OrderEntity) => {
        return customer.id === user.id && OrderStatus.Pending === status;
      }); // can update only his own orders with status pending
      // FAQ
      can(
        [Action.Read],
        FaqEntity,
        ({ isPublished }: FaqEntity) => isPublished,
      ); // can read only published faq
      // Balance
      can([Action.Read], BalanceEntity);
      // Notifications
      can([Action.Read], NotificationEntity);
    }

    if (user.role === Role.SuperAdmin || user.role === Role.Admin) {
      cannot([Action.AddTo, Action.RemoveFrom], CartEntity);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: lambdaMatcher,
    });
  }
}
