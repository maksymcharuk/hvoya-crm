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

type Subjects =
  | InferSubjects<
      | typeof UserEntity
      | typeof ProductCategoryEntity
      | typeof ProductBaseEntity
      | typeof ProductVariantEntity
    >
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(payload: JwtTokenPayload) {
    const { can, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
      PureAbility as AbilityClass<AppAbility>,
    );

    const { user } = payload;

    if (user.role === Role.SuperAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    }

    if (user.role === Role.Admin) {
      can([Action.Read, Action.Update], UserEntity); // read-only access to User table
      can(Action.Manage, ProductCategoryEntity); // read-only access to Product Category table
      can(Action.Manage, ProductBaseEntity); // read-only access to Product Base table
      can(Action.Manage, ProductVariantEntity); // read-only access to Product Variant table
    }

    if (user.role === Role.User) {
      can([Action.Read, Action.Update], UserEntity); // read-write access to User table
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
