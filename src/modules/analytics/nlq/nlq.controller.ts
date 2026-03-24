import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { NlqRequestDto } from './nlq.dto';
import { NlqService } from './nlq.service';

@Controller('analytics/nlq')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class NlqController {
  constructor(private readonly nlqService: NlqService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'AdminAalytics'))
  query(@Body() dto: NlqRequestDto) {
    return this.nlqService.query(dto);
  }
}
