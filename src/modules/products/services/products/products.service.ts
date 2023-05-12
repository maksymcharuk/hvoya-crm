import { DataSource } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateProductDto } from '@dtos/create-product.dto';
import { UpdateProductDto } from '@dtos/update-product.dto';
import { PageOptionsDto } from '@dtos/page-options.dto';
import { PageDto } from '@dtos/page.dto';
import { PageMetaDto } from '@dtos/page-meta.dto';

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
  ) { }

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
          stock: createProductDto.productVariantStock,
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
          stock: updateProductDto.productVariantStock,
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

  async getProducts(): Promise<ProductBaseEntity[]> {
    let products = await this.dataSource.manager.find(ProductBaseEntity, {
      relations: [
        'category',
        'variants',
        'variants.properties',
        'variants.properties.images',
      ],
    });

    // TODO: Rewrite this to query
    products = products.filter(
      (product: ProductBaseEntity) => product.variants.length > 0,
    );

    return products;
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

  async getFilteredProducts(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<ProductBaseEntity>> {
    const queryBuilder = this.dataSource.createQueryBuilder(ProductBaseEntity, 'product');

    console.log(pageOptionsDto.skip, 'skip');
    console.log(pageOptionsDto.take, 'take');

    queryBuilder
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('variant.properties', 'properties')
      .leftJoinAndSelect('properties.images', 'images')
      .leftJoinAndSelect('properties.color', 'color')
      .leftJoinAndSelect('properties.size', 'size')

    if (pageOptionsDto.category) {
      const categoryIds = pageOptionsDto.category.split(',');
      queryBuilder.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    if (pageOptionsDto.size) {
      const sizeIds = pageOptionsDto.size.split(',');
      queryBuilder.andWhere('size.id IN (:...sizeIds)', { sizeIds });
    }

    if (pageOptionsDto.color) {
      const colorIds = pageOptionsDto.color.split(',');
      queryBuilder.andWhere('color.id IN (:...colorIds)', { colorIds });
    }

    if (pageOptionsDto.searchKey) {
      queryBuilder.andWhere('LOWER(properties.name) LIKE LOWER(:searchKey)', { searchKey: `%${pageOptionsDto.searchKey}%` })
    }

    queryBuilder
      .orderBy(`properties.${pageOptionsDto.orderBy}`, pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getProductsCategories(): Promise<ProductCategoryEntity[]> {
    return this.dataSource.manager.find(ProductCategoryEntity);
  }
}
