import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';
import { ReturnRequestService } from '@modules/requests/return-requests/services/return-request/return-request.service';

import { User } from '@decorators/user.decorator';

import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards } from '@nestjs/common';

import { Action } from '@enums/action.enum';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { CreateReturnRequestDto } from '@dtos/create-return-request.dto';

@Controller('return-request')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ReturnRequestController {

  constructor(
    private returnRequestService: ReturnRequestService,
  ) { }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, OrderReturnRequestEntity))
  async getOrders(@User('id') userId: string): Promise<OrderReturnRequestEntity[]> {
    return this.returnRequestService.getReturnRequests(userId);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, OrderReturnRequestEntity),
  )
  createReturnRequest(
    @User('id') userId: string,
    @Body() createReturnRequestDto: CreateReturnRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    waybill?: Express.Multer.File,
  ) {
    return this.returnRequestService.createReturnRequest(userId, createReturnRequestDto, waybill);
  }
}
