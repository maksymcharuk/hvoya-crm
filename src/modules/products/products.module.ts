import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductColorEntity } from '@entities/product-color.entity';
import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductSizeEntity } from '@entities/product-size.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';

import { CaslModule } from '../casl/casl.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FilesModule } from '../files/files.module';
import { ProductColorsController } from './controllers/product-colors/product-colors.controller';
import { ProductSizesController } from './controllers/product-sizes/product-sizes.controller';
import { ProductsController } from './controllers/products/products.controller';
import { ProductColorsService } from './services/product-colors/product-colors.service';
import { ProductSizesService } from './services/product-sizes/product-sizes.service';
import { ProductsService } from './services/products/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategoryEntity,
      ProductBaseEntity,
      ProductVariantEntity,
      ProductPropertiesEntity,
      ProductColorEntity,
      ProductSizeEntity,
    ]),
    CaslModule,
    CloudinaryModule,
    FilesModule,
  ],
  controllers: [
    ProductsController,
    ProductColorsController,
    ProductSizesController,
  ],
  providers: [ProductsService, ProductColorsService, ProductSizesService],
})
export class ProductsModule {}
