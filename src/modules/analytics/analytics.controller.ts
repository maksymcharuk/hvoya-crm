import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { OrdersAnalyticsForAdminsPageOptionsDto } from '@dtos/analytics/orders-analytics-for-admins-page-options.dto';
import { UsersAnalyticsForAdminsPageOptionsDto } from '@dtos/analytics/users-analytics-for-admins-page-options.dto';
import { Action } from '@enums/action.enum';
import { Page } from '@interfaces/page.interface';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { AnalyticsService } from './services/analytics.service';
import { UserData } from './types';

@Controller('analytics')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admins/users')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getUserDataForAdmins(
    @Query()
    usersAnalyticsForAdminsPageOptionsDto: UsersAnalyticsForAdminsPageOptionsDto,
  ): Promise<Page<UserData>> {
    return this.analyticsService.getUserDataForAdmins(
      usersAnalyticsForAdminsPageOptionsDto,
    );
  }

  @Get('admins/orders')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'AdminAalytics'),
  )
  getOrderDataForAdmins(
    @User('id') currentUserId: string,
    @Query()
    ordersAnalyticsForAdminsPageOptionsDto: OrdersAnalyticsForAdminsPageOptionsDto,
  ) {
    return this.analyticsService.getOrderDataForAdmins(
      currentUserId,
      ordersAnalyticsForAdminsPageOptionsDto,
    );
  }
}
