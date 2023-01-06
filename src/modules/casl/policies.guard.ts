import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CaslAbilityFactory,
  AppAbility,
} from './casl-ability/casl-ability.factory';
import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import { PolicyHandler } from './policy-handler';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();

    const ability = this.caslAbilityFactory.createForUser(
      user as JwtTokenPayload,
    );

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
