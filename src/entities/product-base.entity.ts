import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductCategoryEntity } from './product-category.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('product_base')
export class ProductBaseEntity extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @ManyToOne(() => ProductCategoryEntity, (productCategory) => productCategory.products)
    category: ProductCategoryEntity;

    @OneToMany(() => ProductVariantEntity, (productVariant) => productVariant.baseProduct)
    variants: ProductVariantEntity[];
}
