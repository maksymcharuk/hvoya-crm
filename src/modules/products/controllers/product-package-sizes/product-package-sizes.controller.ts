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

import { ProductPackageSizesService } from '@modules/products/services/product-package-sizes/product-package-sizes.service';

import { JwtAuthGuard } from '../../../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../../../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../../../casl/check-policies.decorator';
import { PoliciesGuard } from '../../../casl/policies.guard';

@Controller('product-package-sizes')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProductPackageSizesController {
  constructor(private productPackageSizesService: ProductPackageSizesService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, ProductSizeEntity),
  )
  createPackageSize(@Body() body: CreateProductSizeDto) {
    return this.productPackageSizesService.createPackageSize(body);
  }

  @Put(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, ProductSizeEntity),
  )
  updatePackageSize(
    @Param('id') id: string,
    @Body() body: Partial<CreateProductSizeDto>,
  ) {
    return this.productPackageSizesService.updatePackageSize(id, body);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductSizeEntity),
  )
  getAllPackageSizes() {
    return this.productPackageSizesService.getAllPackageSizes();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductSizeEntity),
  )
  getSizeById(@Param('id') id: string) {
    return this.productPackageSizesService.getPackageSizeById(id);
  }
}
