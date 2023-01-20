import { CreateProductDto } from '@dtos/create-product.dto';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(
        private dataSource: DataSource,
    ) { }

    async createProduct(createProductDto: CreateProductDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        let productCategoryId = createProductDto.productCategoryId;
        let productBaseId = createProductDto.productBaseId;
        let savedProductCategory = null;
        let savedProductBase = null;

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!productBaseId) {
                if (!productCategoryId) {
                    const newProductCategory = await queryRunner.manager.create(ProductCategoryEntity, createProductDto.productCategory);
                    savedProductCategory = await queryRunner.manager.save(newProductCategory) as ProductCategoryEntity;
                } else {
                    savedProductCategory = await queryRunner.manager.findOneByOrFail(ProductCategoryEntity, { id: productCategoryId }) as ProductCategoryEntity;
                }

                const newBaseProduct = await queryRunner.manager.create(ProductBaseEntity, {
                    ...createProductDto.productBase,
                    category: savedProductCategory
                });
                savedProductBase = await queryRunner.manager.save(newBaseProduct);
            } else {
                savedProductBase = await queryRunner.manager.findOneByOrFail(ProductBaseEntity, { id: productBaseId }) as ProductBaseEntity;
            }


            const newProductVariant = await queryRunner.manager.create(ProductVariantEntity, {
                ...createProductDto.productVariant,
                baseProduct: savedProductBase
            });
            await queryRunner.manager.save(newProductVariant);

            await queryRunner.commitTransaction();
        } catch (err) {
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
