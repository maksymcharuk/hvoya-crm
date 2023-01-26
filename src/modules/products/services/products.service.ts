import { CreateProductDto } from '@dtos/create-product.dto';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../../modules/cloudinary/services/cloudinary.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(
        private dataSource: DataSource,
        private cloudinary: CloudinaryService
    ) { }

    async createProduct(createProductDto: CreateProductDto, images: Array<Express.Multer.File>) {
        const queryRunner = this.dataSource.createQueryRunner();
        let productCategoryId = createProductDto.productCategoryId;
        let productBaseId = createProductDto.productBaseId;
        let savedProductCategory = null;
        let savedProductBase = null;
        let productVariantImagesIds = [];

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!productBaseId) {
                if (!productCategoryId) {
                    const newProductCategory = await queryRunner.manager.create(ProductCategoryEntity, { name: createProductDto.productCategoryName });
                    savedProductCategory = await queryRunner.manager.save(newProductCategory) as ProductCategoryEntity;
                } else {
                    savedProductCategory = await queryRunner.manager.findOneByOrFail(ProductCategoryEntity, { id: productCategoryId }) as ProductCategoryEntity;
                }

                const newBaseProduct = await queryRunner.manager.create(ProductBaseEntity, {
                    ...{ name: createProductDto.productBaseName },
                    category: savedProductCategory
                });
                savedProductBase = await queryRunner.manager.save(newBaseProduct);
            } else {
                savedProductBase = await queryRunner.manager.findOneByOrFail(ProductBaseEntity, { id: productBaseId }) as ProductBaseEntity;
            }

            productVariantImagesIds = await Promise.all(images.map(async (image) => {
                return (await this.cloudinary.uploadImageToCloudinary(image))?.public_id;
            }));

            const newProductVariant = await queryRunner.manager.create(ProductVariantEntity, {
                ...{
                    sku: createProductDto.productVariantSku,
                    name: createProductDto.productVariantName,
                    description: createProductDto.productVariantDescription,
                    size: createProductDto.productVariantSize,
                    color: createProductDto.productVariantColor,
                    price: createProductDto.productVariantPrice,
                    availableItemCount: createProductDto.productVariantAvailableItemCount,
                    images: productVariantImagesIds,
                },
                baseProduct: savedProductBase
            });
            await queryRunner.manager.save(newProductVariant);

            await queryRunner.commitTransaction();
        } catch (err) {
            await this.cloudinary.removeImageFromCloudinary(productVariantImagesIds);
            await queryRunner.rollbackTransaction();
            throw new HttpException(
                err.message,
                HttpStatus.BAD_REQUEST,
            );
        } finally {
            await queryRunner.release();
        }
    }
}
