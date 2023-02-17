import { DataSource } from 'typeorm';

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '@entities/user.entity';
import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';

import {
  AppAbility,
  CaslAbilityFactory,
} from './casl-ability/casl-ability.factory';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import { PolicyHandler } from './policy-handler';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const token: JwtTokenPayload = context.switchToHttp().getRequest().user;

    let userEntity: UserEntity;
    try {
      userEntity = await this.dataSource
        .createEntityManager()
        .findOneOrFail(UserEntity, {
          where: { id: token.user.id },
        });
    } catch (error) {
      throw new HttpException('User not found', 404);
    }

    const ability = this.caslAbilityFactory.createForUser(userEntity);

    return policyHandlers.every((handler) => {
      return this.execPolicyHandler(handler, ability);
    });
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
