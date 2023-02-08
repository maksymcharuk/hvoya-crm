import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';

import { CaslModule } from '../casl/casl.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FilesModule } from '../files/files.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './services/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategoryEntity,
      ProductBaseEntity,
      ProductVariantEntity,
    ]),
    CaslModule,
    CloudinaryModule,
    FilesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
