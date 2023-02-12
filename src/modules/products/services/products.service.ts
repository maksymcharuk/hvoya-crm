import { DataSource } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateProductDto } from '@dtos/create-product.dto';
import { FileEntity } from '@entities/file.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { Folder } from '@enums/folder.enum';

import { FilesService } from '../../../modules/files/services/files.service';

@Injectable()
export class ProductsService {
  constructor(
    private dataSource: DataSource,
    private filesService: FilesService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    images: Array<Express.Multer.File>,
  ): Promise<ProductVariantEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    const productCategoryId = createProductDto.productCategoryId;
    const productBaseId = createProductDto.productBaseId;
    let savedProductCategory = null;
    let savedProductBase = null;
    let productImages: FileEntity[] = [];

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!productBaseId) {
        if (!productCategoryId) {
          const newProductCategory = await queryRunner.manager.create(
            ProductCategoryEntity,
            { name: createProductDto.productCategoryName },
          );
          savedProductCategory = (await queryRunner.manager.save(
            newProductCategory,
          )) as ProductCategoryEntity;
        } else {
          savedProductCategory = (await queryRunner.manager.findOneByOrFail(
            ProductCategoryEntity,
            { id: productCategoryId },
          )) as ProductCategoryEntity;
        }

        const newBaseProduct = await queryRunner.manager.create(
          ProductBaseEntity,
          {
            name: createProductDto.productBaseName,
            category: savedProductCategory,
          },
        );
        savedProductBase = await queryRunner.manager.save(newBaseProduct);
      } else {
        savedProductBase = (await queryRunner.manager.findOneByOrFail(
          ProductBaseEntity,
          { id: productBaseId },
        )) as ProductBaseEntity;
      }

      productImages = await Promise.all(
        images.map((image) => {
          return this.filesService.uploadFile(queryRunner, image, {
            folder: Folder.ProductImages,
          });
        }),
      );

      const productProperties = await queryRunner.manager.save(
        ProductPropertiesEntity,
        {
          name: createProductDto.productVariantName,
          description: createProductDto.productVariantDescription,
          size: createProductDto.productVariantSize,
          color: createProductDto.productVariantColor,
          price: createProductDto.productVariantPrice,
          images: productImages,
        },
      );
      const savedProductVariant = await queryRunner.manager.save(
        ProductVariantEntity,
        {
          sku: createProductDto.productVariantSku,
          properties: { id: productProperties.id },
          baseProduct: savedProductBase,
        },
      );

      await queryRunner.manager.save(ProductPropertiesEntity, {
        ...productProperties,
        product: { id: savedProductVariant.id },
      });

      await queryRunner.commitTransaction();
      return savedProductVariant;
    } catch (err) {
      try {
        await this.filesService.deleteFilesCloudinary(productImages);
      } finally {
        await queryRunner.rollbackTransaction();
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    } finally {
      await queryRunner.release();
    }
  }

  getProducts(): Promise<ProductBaseEntity[]> {
    return this.dataSource.manager.find(ProductBaseEntity, {
      relations: [
        'category',
        'variants',
        'variants.properties',
        'variants.properties.images',
      ],
    });
  }

  getProductsForCrete(): Promise<ProductBaseEntity[]> {
    return this.dataSource.manager.find(ProductBaseEntity, {
      relations: ['category'],
    });
  }
}
