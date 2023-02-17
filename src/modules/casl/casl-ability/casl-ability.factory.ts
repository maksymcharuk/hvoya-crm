import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { CartEntity } from '@entities/cart.entity';
import { OrderEntity } from '@entities/order.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { Role } from '@enums/role.enum';

type Subjects =
  | InferSubjects<
      | typeof UserEntity
      | typeof ProductCategoryEntity
      | typeof ProductBaseEntity
      | typeof ProductVariantEntity
      | typeof CartEntity
      | typeof OrderEntity
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
    }

    if (user.role === Role.User) {
      can([Action.Read, Action.Update], UserEntity);
      // Products
      can(Action.Read, ProductCategoryEntity);
      can(Action.Read, ProductBaseEntity);
      can(Action.Read, ProductVariantEntity);
      // Cart
      can([Action.Read, Action.AddTo, Action.RemoveFrom], CartEntity);
      // Orders
      can([Action.Manage], OrderEntity, ({ customer }: OrderEntity) => {
        return customer.id === user.id;
      }); // can manage only his own orders
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
