import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductColorEntity } from '@entities/product-color.entity';
import { ProductPackageSizeEntity } from '@entities/product-package-size.entity';
import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductSizeEntity } from '@entities/product-size.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';

import { CaslModule } from '../casl/casl.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FilesModule } from '../files/files.module';
import { ProductColorsController } from './controllers/product-colors/product-colors.controller';
import { ProductPackageSizesController } from './controllers/product-package-sizes/product-package-sizes.controller';
import { ProductSizesController } from './controllers/product-sizes/product-sizes.controller';
import { ProductsController } from './controllers/products/products.controller';
import { ProductColorsService } from './services/product-colors/product-colors.service';
import { ProductPackageSizesService } from './services/product-package-sizes/product-package-sizes.service';
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
      ProductPackageSizeEntity,
    ]),
    CaslModule,
    CloudinaryModule,
    FilesModule,
  ],
  controllers: [
    ProductsController,
    ProductColorsController,
    ProductSizesController,
    ProductPackageSizesController,
  ],
  providers: [
    ProductsService,
    ProductColorsService,
    ProductSizesService,
    ProductPackageSizesService,
  ],
})
export class ProductsModule {}
