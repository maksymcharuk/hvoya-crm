import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CreateFaqDto } from '@dtos/create-faq.dto';
import { UpdateFaqDto } from '@dtos/update-faq.dto';
import { FaqEntity } from '@entities/faq.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
  getAll(): Promise<FaqEntity[]> {
    return this.faqService.getAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, FaqEntity))
  findById(@Param('id', ParseIntPipe) id: number): Promise<FaqEntity> {
    return this.faqService.findById(id);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, FaqEntity))
  create(@Body() faq: CreateFaqDto): Promise<FaqEntity> {
    return this.faqService.create(faq);
  }

  @Put(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, FaqEntity))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() faq: UpdateFaqDto,
  ): Promise<FaqEntity> {
    return this.faqService.update(id, faq);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, FaqEntity))
  delete(@Param('id', ParseIntPipe) id: number): Promise<FaqEntity> {
    return this.faqService.delete(id);
  }
}
