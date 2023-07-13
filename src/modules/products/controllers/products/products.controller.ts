import { CacheInterceptor } from '@nestjs/cache-manager';
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
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { User } from '@decorators/user.decorator';
import { CreateProductDto } from '@dtos/create-product.dto';
import { PageOptionsDto } from '@dtos/page-options.dto';
import { PageDto } from '@dtos/page.dto';
import { UpdateProductDto } from '@dtos/update-product.dto';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../../../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../../../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../../../casl/check-policies.decorator';
import { PoliciesGuard } from '../../../casl/policies.guard';
import { ProductsService } from '../../services/products/products.service';

@Controller('products')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Create, ProductCategoryEntity) &&
      ability.can(Action.Create, ProductBaseEntity) &&
      ability.can(Action.Create, ProductVariantEntity),
  )
  createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    images?: Array<Express.Multer.File>,
  ) {
    return this.productsService.createProduct(body, images);
  }

  @Put()
  @UseInterceptors(FilesInterceptor('images'))
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Update, ProductCategoryEntity) &&
      ability.can(Action.Update, ProductBaseEntity) &&
      ability.can(Action.Update, ProductVariantEntity),
  )
  editProduct(
    @Body() body: UpdateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    images?: Array<Express.Multer.File>,
  ) {
    return this.productsService.editProduct(body, images);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductBaseEntity),
  )
  getProducts(@User('id') userId: string) {
    return this.productsService.getProducts(userId);
  }

  @Get('categories')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductCategoryEntity),
  )
  getProductsCategories() {
    return this.productsService.getProductsCategories();
  }

  @Get('filtered')
  @UseInterceptors(CacheInterceptor)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductBaseEntity),
  )
  getFilteredProducts(
    @User('id') userId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductBaseEntity>> {
    return this.productsService.getFilteredProducts(userId, pageOptionsDto);
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductBaseEntity),
  )
  getProduct(@User('id') userId: string, @Param('id') id: string) {
    return this.productsService.getProduct(id, userId);
  }
}
