import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { BalanceEntity } from '@entities/balance.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { BalanceService } from './services/balance.service';

@Controller('balance')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, BalanceEntity),
  )
  getByUserId(@User('id') currentUserId: string): Promise<BalanceEntity> {
    return this.balanceService.getByUserId(currentUserId);
  }

  // temporary "testing" solution
  @Post('add')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, BalanceEntity),
  )
  addFunds(
    @User('id') currentUserId: string,
    @Body('amount') amount: number,
  ): Promise<BalanceEntity> {
    return this.balanceService.addFunds(currentUserId, amount);
  }
}
