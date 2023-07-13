import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateProductColorDto } from '@dtos/create-product-color.dto';
import { ProductColorEntity } from '@entities/product-color.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../../../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../../../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../../../casl/check-policies.decorator';
import { PoliciesGuard } from '../../../casl/policies.guard';
import { ProductColorsService } from '../../services/product-colors/product-colors.service';

@Controller('product-colors')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProductColorsController {
  constructor(private productColorsService: ProductColorsService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, ProductColorEntity),
  )
  createColor(@Body() body: CreateProductColorDto) {
    return this.productColorsService.createColor(body);
  }

  @Put(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, ProductColorEntity),
  )
  updateColor(
    @Param('id') id: string,
    @Body() body: Partial<CreateProductColorDto>,
  ) {
    return this.productColorsService.updateColor(id, body);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductColorEntity),
  )
  getAllColors() {
    return this.productColorsService.getAllColors();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductColorEntity),
  )
  getColorById(@Param('id') id: string) {
    return this.productColorsService.getColorById(id);
  }
}
