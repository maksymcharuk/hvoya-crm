import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './products.controller';
import { ProductsService } from './services/products.service';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { CaslModule } from '../casl/casl.module';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity, ProductBaseEntity, ProductVariantEntity]), CaslModule, CloudinaryModule, FilesModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
