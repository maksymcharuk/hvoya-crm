import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '@decorators/user.decorator';
import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';
import { CreateRequestDto } from '@dtos/create-request.dto';
import { UpdateRequestByCustomerDto } from '@dtos/update-request-by-customer.dto';
import { RequestEntity } from '@entities/request.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { RequestService } from './request.service';

@Controller('request')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, RequestEntity),
  )
  async getRequests(@User('id') userId: string): Promise<RequestEntity[]> {
    return this.requestService.getRequests(userId);
  }

  @Get(':number')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, RequestEntity),
  )
  async getRequest(
    @User('id') userId: string,
    @Param('number') number: string,
  ): Promise<RequestEntity> {
    return this.requestService.getRequest(userId, number);
  }

  @Post()
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, RequestEntity),
  )
  async createRequest(
    @User('id') userId: string,
    @Body() createRequestDto: CreateRequestDto,
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
  ): Promise<RequestEntity> {
    return this.requestService.createRequest(userId, createRequestDto, waybill);
  }

  @Put(':number/approve')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Confirm, RequestEntity),
  )
  async approveRequest(
    @User('id') userId: string,
    @Param('number') number: string,
    @Body() approveRequestDto: ApproveReturnRequestDto,
  ): Promise<RequestEntity> {
    return this.requestService.approveRequest(
      userId,
      number,
      approveRequestDto,
    );
  }

  @Put(':number/update-by-customer')
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, RequestEntity),
  )
  async updateRequestWaybill(
    @User('id') userId: string,
    @Param('number') requestNumber: string,
    @Body() updateRequestByCustomerDto: UpdateRequestByCustomerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    waybill: Express.Multer.File,
  ): Promise<RequestEntity> {
    return this.requestService.updateRequestByCustomer(
      userId,
      requestNumber,
      updateRequestByCustomerDto,
      waybill,
    );
  }
}
