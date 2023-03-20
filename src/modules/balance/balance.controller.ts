import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { BalanceEntity } from '@entities/balance.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PoliciesGuard } from '../casl/policies.guard';
import { BalanceService } from './services/balance.service';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';

import { User } from '@decorators/user.decorator';

@Controller('balance')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) { }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, BalanceEntity))
  getByUserId(@User('id') id: number,): Promise<BalanceEntity> {
    return this.balanceService.getByUserId(id);
  }

  // temporary "testing" solution
  @Post('add')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, BalanceEntity))
  addFunds(@User('id') id: number, @Body('amount') amount: number): Promise<BalanceEntity> {
    return this.balanceService.addFunds(id, amount);
  }

}
