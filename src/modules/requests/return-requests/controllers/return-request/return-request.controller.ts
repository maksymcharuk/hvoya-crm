import { User } from '@decorators/user.decorator';

import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';
import { RequestEntity } from '@entities/request.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';
import { RequestService } from '@modules/requests/services/request/request.service';

import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

@Controller('return-request')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ReturnRequestController {

  constructor(private requestService: RequestService) { }

  @Post('approve/:number')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Confirm, RequestEntity),
  )
  async approveRequest(
    @User('id') userId: string,
    @Body() approveRequestDto: ApproveReturnRequestDto,
    @Param('number') number: string,
  ): Promise<RequestEntity> {
    return this.requestService.approveRequest(userId, number, approveRequestDto);
  }
}
