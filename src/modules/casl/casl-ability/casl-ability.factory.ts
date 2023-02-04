import { Injectable } from '@nestjs/common';
import {
  PureAbility,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  ExtractSubjectType,
} from '@casl/ability';

import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { Role } from '@enums/role.enum';
import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { CartEntity } from '@entities/cart.entity';

type Subjects =
  | InferSubjects<
      | typeof UserEntity
      | typeof ProductCategoryEntity
      | typeof ProductBaseEntity
      | typeof ProductVariantEntity
      | typeof CartEntity
    >
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(payload: JwtTokenPayload) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    const { user } = payload;

    if (user.role === Role.SuperAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    }

    if (user.role === Role.Admin) {
      can([Action.Read, Action.Update], UserEntity);
      // Products
      can([Action.Read, Action.Create, Action.Update], ProductCategoryEntity);
      can([Action.Read, Action.Create, Action.Update], ProductBaseEntity);
      can([Action.Read, Action.Create, Action.Update], ProductVariantEntity);
    }

    if (user.role === Role.User) {
      can([Action.Read, Action.Update], UserEntity);
      // Products
      can(Action.Read, ProductCategoryEntity);
      can(Action.Read, ProductBaseEntity);
      can(Action.Read, ProductVariantEntity);
      // Cart
      can([Action.Read, Action.AddTo, Action.RemoveFrom], CartEntity);
    }

    if (user.role === Role.SuperAdmin || user.role === Role.Admin) {
      cannot([Action.AddTo, Action.RemoveFrom], CartEntity);
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
