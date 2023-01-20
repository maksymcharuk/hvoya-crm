import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductBaseEntity } from './product-base.entity';

@Entity('product_variant')
export class ProductVariantEntity extends BaseEntity {
    @Column({ unique: true })
    sku: string;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column()
    size: string;

    @Column()
    color: string;

    @Column({ type: 'numeric', precision: 2, scale: 2 })
    price: number;

    @Column()
    availableItemCount: number;

    @ManyToOne(() => ProductBaseEntity, (productBase) => productBase.variants)
    baseProduct: ProductBaseEntity;
}
