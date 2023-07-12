import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  CacheTTL,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { AnalyticsService } from './services/analytics.service';

@Controller('analytics')
@UseInterceptors(CacheInterceptor)
@CacheTTL(60 * 1000)
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admins')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getAnalyticDataForAdmins(@User('id') currentUserId: string): Promise<any> {
    return this.analyticsService.getAnalyticDataForAdmins(currentUserId);
  }
}
