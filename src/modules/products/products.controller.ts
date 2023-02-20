import { FileTypeValidator } from '@validators/ files-type.validator';
import { MaxFilesSizeValidator } from '@validators/max-files-size.validator';

import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CreateProductDto } from '@dtos/create-product.dto';
import { EditProductDto } from '@dtos/edit-product.dto';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { Action } from '@enums/action.enum';

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
          new MaxFilesSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
        ],
      }),
    )
    images: Array<Express.Multer.File>,
  ) {
    return this.productsService.createProduct(body, images);
  }

  @Put()
  @UseInterceptors(FilesInterceptor('images'))
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Edit, ProductCategoryEntity) &&
      ability.can(Action.Edit, ProductBaseEntity) &&
      ability.can(Action.Edit, ProductVariantEntity),
  )
  editProduct(
    @Body() body: EditProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFilesSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
        ],
      }),
    )
    images: Array<Express.Multer.File>,
  ) {
    return this.productsService.editProduct(body, images);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, ProductBaseEntity),
  )
  getProducts() {
    return this.productsService.getProducts();
  }
}
