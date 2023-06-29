import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { CreateFaqDto } from '@dtos/create-faq.dto';
import { UpdateFaqBatchDto } from '@dtos/update-faq-batch.dto';
import { UpdateFaqDto } from '@dtos/update-faq.dto';
import { FaqEntity } from '@entities/faq.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { FaqService } from './services/faq.service';

@Controller('faq')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, FaqEntity))
  getAll(@User('id') userId: string): Promise<FaqEntity[]> {
    return this.faqService.getAll(userId);
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, FaqEntity))
  findById(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<FaqEntity> {
    return this.faqService.findById(id, userId);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, FaqEntity))
  create(@Body() faq: CreateFaqDto): Promise<FaqEntity> {
    return this.faqService.create(faq);
  }

  @Put(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, FaqEntity))
  update(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() faq: UpdateFaqDto,
  ): Promise<FaqEntity> {
    return this.faqService.update(id, faq, userId);
  }

  @Put()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, FaqEntity))
  updateBatch(@Body() faqList: UpdateFaqBatchDto[]): Promise<FaqEntity[]> {
    return this.faqService.updateBatch(faqList);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, FaqEntity))
  delete(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<FaqEntity> {
    return this.faqService.delete(id, userId);
  }
}
