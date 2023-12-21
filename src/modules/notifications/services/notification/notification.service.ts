import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { NotificationsPageOptionsDto } from '@dtos/notifications-page-options.dto';
import { NotificationEntity } from '@entities/notification.entity';
import { UserEntity } from '@entities/user.entity';
import { SocketEvent } from '@enums/socket-event.enum';
import { SortOrder } from '@enums/sort-order.enum';
import { WSocketGateway } from '@gateways/websocket/websocket.gateway';
import { NotificationCreatedEvent } from '@interfaces/notifications/notification-created.interface';
import { PageMeta } from '@interfaces/page-meta.interface';
import { Page } from '@interfaces/page.interface';

@Injectable()
export class NotificationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly wSocketGateway: WSocketGateway,
  ) {}

  async getAll(
    userId: string,
    pageOptionsDto: NotificationsPageOptionsDto,
  ): Promise<Page<NotificationEntity>> {
    const query = this.dataSource
      .createQueryBuilder(NotificationEntity, 'notification')
      .where('notification.user = :userId', { userId })
      .orderBy('notification.createdAt', SortOrder.DESC)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    query.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await query.getCount();
    let { entities } = await query.getRawAndEntities();

    const pageMetaDto = new PageMeta({ itemCount, pageOptionsDto });

    return new Page(entities, pageMetaDto);
  }

  async create(user: UserEntity, payload: NotificationCreatedEvent) {
    const notification = await this.dataSource.manager.save(
      NotificationEntity,
      {
        message: payload.message,
        data: payload.data,
        type: payload.type,
        user: user,
      },
    );
    this.wSocketGateway.sendToUser(
      user.id,
      SocketEvent.NotificationCreate,
      notification,
    );
    return notification;
  }

  async check(id: string, userId: string): Promise<Page<NotificationEntity>> {
    await this.dataSource.manager.update(
      NotificationEntity,
      { id },
      { checked: true },
    );
    return this.getAll(userId, new NotificationsPageOptionsDto({ take: 10 }));
  }
}
