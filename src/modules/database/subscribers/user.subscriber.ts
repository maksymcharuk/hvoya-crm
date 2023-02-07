import * as bcrypt from 'bcrypt';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { UserEntity } from '../../../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity;
  }

  async hashPassword(entity: UserEntity): Promise<void> {
    entity.password = await bcrypt.hash(entity.password, 8);
  }

  beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    return this.hashPassword(event.entity);
  }

  async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<UserEntity>): Promise<void> {
    if (entity && entity['password'] !== databaseEntity?.password) {
      await this.hashPassword(entity as UserEntity);
    }
  }
}
