import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductColorEntity } from '@entities/product-color.entity';
import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';

import { CaslModule } from '../casl/casl.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FilesModule } from '../files/files.module';
import { ProductColorsController } from './controllers/product-colors/product-colors.controller';
import { ProductsController } from './controllers/products/products.controller';
import { ProductColorsService } from './services/product-colors/product-colors.service';
import { ProductsService } from './services/products/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategoryEntity,
      ProductBaseEntity,
      ProductVariantEntity,
      ProductPropertiesEntity,
      ProductColorEntity,
    ]),
    CaslModule,
    CloudinaryModule,
    FilesModule,
  ],
  controllers: [ProductsController, ProductColorsController],
  providers: [ProductsService, ProductColorsService],
})
export class ProductsModule {}
