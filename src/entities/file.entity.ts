import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('file')
export class FileEntity extends BaseEntity {

  @Column()
  public_id: string;

  @Column()
  url: string;

  @ManyToOne(() => ProductVariantEntity, (productVariant) => productVariant.images)
  productVariant: ProductVariantEntity;
}
