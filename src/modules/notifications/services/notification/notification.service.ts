import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NotificationEntity } from '@entities/notification.entity';
import { UserEntity } from '@entities/user.entity';
import { SocketEvent } from '@enums/socket-event.enum';
import { WSocketGateway } from '@gateways/websocket/websocket.gateway';
import { NotificationCreatedEvent } from '@interfaces/notifications/notification-created.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly wSocketGateway: WSocketGateway,
  ) {}

  async getAll(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { checked: 'ASC', createdAt: 'DESC' },
    });
  }

  async create(user: UserEntity, payload: NotificationCreatedEvent) {
    const notification = await this.notificationRepository.save({
      message: payload.message,
      data: payload.data,
      type: payload.type,
      user: user,
    });
    this.wSocketGateway.sendToUser(
      user.id,
      SocketEvent.NotificationCreate,
      notification,
    );
    return notification;
  }

  async check(id: string, userId: string): Promise<NotificationEntity[]> {
    await this.notificationRepository.update({ id }, { checked: true });
    return this.getAll(userId);
  }
}
