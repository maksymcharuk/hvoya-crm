import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { RequestEntity } from '../../../entities/request.entity';

@EventSubscriber()
export class RequestSubscriber implements EntitySubscriberInterface<RequestEntity> {
  listenTo() {
    return RequestEntity;
  }

  async generateRequestNumber(
    entity: RequestEntity,
    manager: EntityManager,
  ): Promise<void> {
    if (entity.number) {
      return;
    }

    const latestRequest = await manager
      .createQueryBuilder(RequestEntity, 'request')
      .orderBy('request.createdAt', 'DESC')
      .getOne();
    const number =
      latestRequest && latestRequest.number ? Number(latestRequest.number) + 1 : 1000;

    entity.number = number.toString();
  }

  beforeInsert(event: InsertEvent<RequestEntity>): Promise<void[]> {
    return Promise.all([this.generateRequestNumber(event.entity, event.manager)]);
  }
}
