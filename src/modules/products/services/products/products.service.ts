import { DataSource } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateProductDto } from '@dtos/create-product.dto';
import { UpdateProductDto } from '@dtos/update-product.dto';
import { FileEntity } from '@entities/file.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { Folder } from '@enums/folder.enum';

import { FilesService } from '../../../../modules/files/services/files.service';

@Injectable()
export class ProductsService {
  constructor(
    private dataSource: DataSource,
    private filesService: FilesService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    images?: Array<Express.Multer.File>,
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

      if (images?.length) {
        productImages = await Promise.all(
          images.map((image) => {
            return this.filesService.uploadFile(queryRunner, image, {
              folder: Folder.ProductImages,
            });
          }),
        );
      }

      const productProperties = await queryRunner.manager.save(
        ProductPropertiesEntity,
        {
          name: createProductDto.productVariantName,
          description: createProductDto.productVariantDescription,
          weight: createProductDto.productVariantWeight,
          size: { id: createProductDto.productVariantSizeId },
          color: { id: createProductDto.productVariantColorId },
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
      return this.getProductVariant({ id: savedProductVariant.id });
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

  async editProduct(
    updateProductDto: UpdateProductDto,
    images?: Array<Express.Multer.File>,
  ): Promise<ProductVariantEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    const productCategoryId = updateProductDto.productCategoryId;
    const productBaseId = updateProductDto.productBaseId;
    let savedProductCategory = null;
    let savedProductBase = null;
    let productImages: FileEntity[] = [];

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!productBaseId) {
        if (!productCategoryId) {
          savedProductCategory = (await queryRunner.manager.save(
            ProductCategoryEntity,
            { name: updateProductDto.productCategoryName },
          )) as ProductCategoryEntity;
        } else {
          savedProductCategory = await queryRunner.manager.findOneByOrFail(
            ProductCategoryEntity,
            { id: productCategoryId },
          );
        }

        savedProductBase = await queryRunner.manager.save(ProductBaseEntity, {
          name: updateProductDto.productBaseName,
          category: savedProductCategory,
        });
      } else {
        await queryRunner.manager.update(
          ProductBaseEntity,
          { id: productBaseId },
          { category: { id: productCategoryId } },
        );
        savedProductBase = await queryRunner.manager.findOneByOrFail(
          ProductBaseEntity,
          { id: productBaseId },
        );
      }

      if (images?.length) {
        productImages = await Promise.all(
          images.map((image) => {
            return this.filesService.uploadFile(queryRunner, image, {
              folder: Folder.ProductImages,
            });
          }),
        );
      }
      productImages = [
        ...productImages,
        ...JSON.parse(updateProductDto.existingImages),
      ];

      const productProperties = await queryRunner.manager.save(
        ProductPropertiesEntity,
        {
          name: updateProductDto.productVariantName,
          description: updateProductDto.productVariantDescription,
          weight: updateProductDto.productVariantWeight,
          size: { id: updateProductDto.productVariantSizeId },
          color: { id: updateProductDto.productVariantColorId },
          price: updateProductDto.productVariantPrice,
          images: productImages,
        },
      );

      await queryRunner.manager.update(
        ProductVariantEntity,
        { id: updateProductDto.productVariantId },
        {
          sku: updateProductDto.productVariantSku,
          properties: { id: productProperties.id },
          baseProduct: { id: savedProductBase.id },
        },
      );

      const savedProductVariant = await queryRunner.manager.findOneByOrFail(
        ProductVariantEntity,
        { id: updateProductDto.productVariantId },
      );

      await queryRunner.manager.save(ProductPropertiesEntity, {
        ...productProperties,
        product: { id: savedProductVariant.id },
      });

      await queryRunner.commitTransaction();
      return this.getProductVariant({ id: savedProductVariant.id });
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

  getProduct(params: { id: number }): Promise<ProductBaseEntity> {
    return this.dataSource.manager.findOneOrFail(ProductBaseEntity, {
      where: params,
      relations: [
        'category',
        'variants',
        'variants.properties',
        'variants.properties.images',
      ],
    });
  }

  getProductVariant(params: { id: number }): Promise<ProductVariantEntity> {
    return this.dataSource.manager.findOneOrFail(ProductVariantEntity, {
      where: params,
      relations: ['properties', 'baseProduct'],
    });
  }
}
