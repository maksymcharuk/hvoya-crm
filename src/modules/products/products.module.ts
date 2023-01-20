import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './products.controller';
import { ProductsService } from './services/products.service';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { CaslModule } from '../casl/casl.module';
import { ProductVariantEntity } from '@entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity, ProductBaseEntity, ProductVariantEntity]), CaslModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
