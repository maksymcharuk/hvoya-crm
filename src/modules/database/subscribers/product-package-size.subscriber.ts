import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HttpException } from '@nestjs/common';

import { ProductPackageSizeEntity } from '../../../entities/product-package-size.entity';

@EventSubscriber()
export class ProductPackageSizeSubscriber
  implements EntitySubscriberInterface<ProductPackageSizeEntity>
{
  listenTo() {
    return ProductPackageSizeEntity;
  }

  async validateUniqueness(
    manager: EntityManager,
    entity: ProductPackageSizeEntity,
  ): Promise<void> {
    const allSizes = await manager.find(ProductPackageSizeEntity);
    const sizeExists = allSizes.find((size) => this.equalSize(size, entity));

    if (sizeExists) {
      throw new HttpException('Такий розмір упаковки вже існує', 400);
    }
  }

  beforeInsert(event: InsertEvent<ProductPackageSizeEntity>): Promise<void> {
    return this.validateUniqueness(event.manager, event.entity);
  }

  async beforeUpdate(
    event: UpdateEvent<ProductPackageSizeEntity>,
  ): Promise<void> {
    let currentSize = await event.manager.findOne(ProductPackageSizeEntity, {
      where: { id: event.databaseEntity.id },
    });
    currentSize = {
      ...currentSize,
      ...(event.entity as ProductPackageSizeEntity),
    };
    return this.validateUniqueness(event.manager, currentSize);
  }

  private equalSize(
    currentSize: ProductPackageSizeEntity,
    upsertEntity: ProductPackageSizeEntity,
  ): boolean {
    return (
      currentSize.height === upsertEntity.height &&
      currentSize.width === upsertEntity.width &&
      currentSize.depth === upsertEntity.depth
    );
  }
}
