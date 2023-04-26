import { UserEntity } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { NotificationCreatedEvent } from '@interfaces/notifications/notification-created.interface';
import { NotificationEntity } from '@entities/notification.entity';

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) { }

  async getAll(userId: number): Promise<NotificationEntity[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { checked: 'ASC', createdAt: 'DESC' },
    });
  }

  create(user: UserEntity, payload: NotificationCreatedEvent) {
    return this.notificationRepository.save({
      message: payload.message,
      url: payload.url,
      user: user
    });
  }

  async check(id: number): Promise<NotificationEntity[]> {
    await this.notificationRepository.update({ id }, { checked: true });
    return this.getAll(id);
  }
}
