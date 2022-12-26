import { Injectable } from '@nestjs/common';
import {
  PureAbility,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  ExtractSubjectType,
} from '@casl/ability';

import { UserEntity } from '../../../entities/user.entity';
import { Action } from '../../../enums/action.enum';
import { Role } from '../../../enums/role.enum';
import { JwtTokenPayload } from '../../../interfaces/jwt-token-payload.interface';

type Subjects = InferSubjects<typeof UserEntity> | 'all';

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

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
