import { DataSource, SelectQueryBuilder } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateProductDto } from '@dtos/create-product.dto';
import { PageMetaDto } from '@dtos/page-meta.dto';
import { PageOptionsDto } from '@dtos/page-options.dto';
import { PageDto } from '@dtos/page.dto';
import { UpdateProductDto } from '@dtos/update-product.dto';
import { FileEntity } from '@entities/file.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { Folder } from '@enums/folder.enum';

import { ProductCategoryEntity } from '../../../../entities/product-category.entity';
import { CaslAbilityFactory } from '../../../../modules/casl/casl-ability/casl-ability.factory';
import { FilesService } from '../../../../modules/files/services/files.service';

@Injectable()
export class ProductsService {
  constructor(
    private dataSource: DataSource,
    private filesService: FilesService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
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
          isPublished: createProductDto.productVariantIsPublished,
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
          isPublished: updateProductDto.productVariantIsPublished,
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

  async getProducts(userId: string): Promise<ProductBaseEntity[]> {
    const user = await this.dataSource.manager.findOneByOrFail(UserEntity, {
      id: userId,
    });
    let products = await this.getProductQuery(undefined, false).getMany();
    const ability = this.caslAbilityFactory.createForUser(user);

    products = products
      .map((product) => {
        product.variants = product.variants.filter((variant) => {
          return ability.can(Action.Read, variant);
        });
        return product;
      })
      .filter((product) => {
        return product.variants.length;
      });

    return products;
  }

  async getProduct(id: string, userId: string): Promise<ProductBaseEntity> {
    let user: UserEntity;
    try {
      user = await this.dataSource.manager.findOneByOrFail(UserEntity, {
        id: userId,
      });
    } catch (error) {
      throw new HttpException('Користувач не знайдений', HttpStatus.NOT_FOUND);
    }
    let product = await this.getProductQuery(id).getOne();
    const ability = this.caslAbilityFactory.createForUser(user);

    if (!product) {
      throw new HttpException('Товар не знайдено', HttpStatus.NOT_FOUND);
    }

    product.variants = product.variants.filter((variant) => {
      return ability.can(Action.Read, variant);
    });

    if (!product.variants.length) {
      throw new HttpException('Товар не знайдено', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  getProductVariant(params: { id: string }): Promise<ProductVariantEntity> {
    return this.dataSource.manager.findOneOrFail(ProductVariantEntity, {
      where: params,
      relations: ['properties', 'baseProduct'],
    });
  }

  async getFilteredProducts(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductBaseEntity>> {
    const user = await this.dataSource.manager.findOneByOrFail(UserEntity, {
      id: userId,
    });
    const ability = this.caslAbilityFactory.createForUser(user);
    const queryBuilder = this.getProductQuery();

    if (pageOptionsDto.category) {
      const categoryIds = pageOptionsDto.category.split(',');
      queryBuilder.andWhere('category.id IN (:...categoryIds)', {
        categoryIds,
      });
    }

    if (pageOptionsDto.size) {
      const sizeIds = pageOptionsDto.size.split(',');
      queryBuilder.andWhere('size.id IN (:...sizeIds)', { sizeIds });
    }

    if (pageOptionsDto.color) {
      const colorIds = pageOptionsDto.color.split(',');
      queryBuilder.andWhere('color.id IN (:...colorIds)', { colorIds });
    }

    if (pageOptionsDto.searchQuery) {
      queryBuilder.andWhere('LOWER(properties.name) LIKE LOWER(:searchQuery)', {
        searchQuery: `%${pageOptionsDto.searchQuery}%`,
      });
    }

    queryBuilder
      // .orderBy(`properties.${pageOptionsDto.orderBy}`, pageOptionsDto.order)
      // .orderBy(`productBase.createdAt`, SortOrder.ASC)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const products = entities
      .map((product) => {
        product.variants = product.variants.filter((variant) => {
          return ability.can(Action.Read, variant);
        });
        return product;
      })
      .filter((product) => {
        return product.variants.length;
      });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(products, pageMetaDto);
  }

  async getProductsCategories(): Promise<ProductCategoryEntity[]> {
    return this.dataSource.manager.find(ProductCategoryEntity);
  }

  getProductQuery(
    id?: string,
    skipEmpty: boolean = true,
  ): SelectQueryBuilder<ProductBaseEntity> {
    const query = this.dataSource.createQueryBuilder(
      ProductBaseEntity,
      'productBase',
    );

    if (id) {
      query.where('productBase.id = :id', { id });
    }

    query
      .leftJoinAndSelect('productBase.category', 'category')
      .leftJoinAndSelect('productBase.variants', 'variants')
      .leftJoinAndSelect('variants.properties', 'properties')
      .leftJoinAndSelect('properties.images', 'images')
      .leftJoinAndSelect('properties.size', 'size')
      .leftJoinAndSelect('properties.color', 'color');

    if (skipEmpty) {
      query.andWhere('variants.id IS NOT NULL');
    }

    return query;
  }
}
