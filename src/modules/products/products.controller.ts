import { CreateProductDto } from '@dtos/create-product.dto';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { Action } from '@enums/action.enum';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { ProductsService } from './services/products.service';

@Controller('products')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Post()
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Create, ProductCategoryEntity) && ability.can(Action.Create, ProductBaseEntity) && ability.can(Action.Create, ProductVariantEntity)
    )
    createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }
}
