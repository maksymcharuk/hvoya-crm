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

import { CreateProductSizeDto } from '@dtos/create-product-size.dto';
import { ProductSizeEntity } from '@entities/product-size.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../../../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../../../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../../../casl/check-policies.decorator';
import { PoliciesGuard } from '../../../casl/policies.guard';
import { ProductSizesService } from '../../services/product-sizes/product-sizes.service';

@Controller('product-sizes')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProductSizesController {
  constructor(private productSizesService: ProductSizesService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, ProductSizeEntity),
  )
  createSize(@Body() body: CreateProductSizeDto) {
    return this.productSizesService.createSize(body);
  }

  @Put(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, ProductSizeEntity),
  )
  updateSize(
    @Param('id') id: string,
    @Body() body: Partial<CreateProductSizeDto>,
  ) {
    return this.productSizesService.updateSize(id, body);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductSizeEntity),
  )
  getAllSizes() {
    return this.productSizesService.getAllSizes();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductSizeEntity),
  )
  getSizeById(@Param('id') id: string) {
    return this.productSizesService.getSizeById(id);
  }
}
