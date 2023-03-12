import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HttpException } from '@nestjs/common';

import { ProductSizeEntity } from '../../../entities/product-size.entity';

@EventSubscriber()
export class ProductSizeSubscriber
  implements EntitySubscriberInterface<ProductSizeEntity>
{
  listenTo() {
    return ProductSizeEntity;
  }

  async validateUniqueness(
    manager: EntityManager,
    entity: ProductSizeEntity,
  ): Promise<void> {
    const allSizes = await manager.find(ProductSizeEntity);
    const sizeExists = allSizes.find((size) => this.equalSize(size, entity));

    if (sizeExists) {
      throw new HttpException('Такий розмір вже існує', 400);
    }
  }

  beforeInsert(event: InsertEvent<ProductSizeEntity>): Promise<void> {
    return this.validateUniqueness(event.manager, event.entity);
  }

  async beforeUpdate(event: UpdateEvent<ProductSizeEntity>): Promise<void> {
    let currentSize = await event.manager.findOne(ProductSizeEntity, {
      where: { id: event.databaseEntity.id },
    });
    currentSize = { ...currentSize, ...(event.entity as ProductSizeEntity) };
    return this.validateUniqueness(event.manager, currentSize);
  }

  private equalSize(
    currentSize: ProductSizeEntity,
    upsertEntity: ProductSizeEntity,
  ): boolean {
    return (
      currentSize.height === upsertEntity.height &&
      currentSize.width === upsertEntity.width &&
      currentSize.depth === upsertEntity.depth &&
      currentSize.diameter === upsertEntity.diameter &&
      currentSize.packageHeight === upsertEntity.packageHeight &&
      currentSize.packageWidth === upsertEntity.packageWidth &&
      currentSize.packageDepth === upsertEntity.packageDepth
    );
  }
}
