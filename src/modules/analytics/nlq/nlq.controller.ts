import { Body, Controller, Headers, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { NlqRequestDto, RunAgentInputDto } from './nlq.dto';
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

  @Post('stream')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'AdminAalytics'))
  async stream(
    @Body() dto: RunAgentInputDto,
    @Res() res: Response,
    @Headers('accept') accept: string,
  ) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    await this.nlqService.stream(dto, res, accept);
  }
}
