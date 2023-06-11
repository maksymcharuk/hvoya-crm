import * as bcrypt from 'bcrypt';
import {
  EntityManager,
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

  async generateAccountNumber(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<void> {
    if (entity.accountNumber) {
      return;
    }

    let code: string;
    do {
      code = Math.floor(10000 + Math.random() * 90000).toString();
    } while (
      await manager.findOne(UserEntity, { where: { accountNumber: code } })
    );
    entity.accountNumber = code;
  }

  beforeInsert(event: InsertEvent<UserEntity>): Promise<void[]> {
    return Promise.all([
      this.hashPassword(event.entity),
      this.generateAccountNumber(event.entity, event.manager),
    ]);
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
