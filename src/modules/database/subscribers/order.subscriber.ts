import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { OrderEntity } from '../../../entities/order.entity';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<OrderEntity> {
  listenTo() {
    return OrderEntity;
  }

  async generateOrderNumber(
    entity: OrderEntity,
    manager: EntityManager,
  ): Promise<void> {
    if (entity.number) {
      return;
    }

    const latestOrder = await manager
      .createQueryBuilder(OrderEntity, 'order')
      .orderBy('order.createdAt', 'DESC')
      .getOne();
    const number =
      latestOrder && latestOrder.number ? Number(latestOrder.number) + 1 : 1000;

    entity.number = number.toString();
  }

  beforeInsert(event: InsertEvent<OrderEntity>): Promise<void[]> {
    return Promise.all([this.generateOrderNumber(event.entity, event.manager)]);
  }
}
