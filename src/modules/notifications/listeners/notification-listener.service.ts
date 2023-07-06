import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { OrderEntity } from '@entities/order.entity';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationCreatedEvent } from '@interfaces/notifications/notification-created.interface';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { UsersService } from '@modules/users/services/users.service';

import { NotificationService } from '../services/notification/notification.service';

@Injectable()
export class NotificationListenerService {
  constructor(
    private usersService: UsersService,
    private notificationService: NotificationService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @OnEvent(NotificationEvent.UserCreated)
  async handleUserCreatedEvent(payload: NotificationCreatedEvent) {
    this.sendNotificationToAdmins(payload);
  }

  @OnEvent(NotificationEvent.UserConfirmed)
  async handleUserConfirmedEvent(payload: NotificationCreatedEvent) {
    this.sendNotificationToAdmins(payload);
  }

  @OnEvent(NotificationEvent.OrderCreated)
  async handleOrderCreatedEvent(payload: NotificationCreatedEvent) {
    this.sendNotificationToAdmins(payload);
  }

  @OnEvent(NotificationEvent.OrderUpdated)
  async handleOrderUpdatedEvent(payload: NotificationCreatedEvent) {
    this.sendNotificationToUser(payload);
  }

  @OnEvent(NotificationEvent.OrderCancelled)
  async handleOrderCancelledEvent(payload: NotificationCreatedEvent) {
    this.sendNotificationToAdmins(payload);
  }

  private async sendNotificationToAdmins(payload: NotificationCreatedEvent) {
    let adminUsers = await this.usersService.getAllAdmins();

    adminUsers.forEach((user) => {
      const ability = this.caslAbilityFactory.createForUser(user);
      this.notificationService.create(user, {
        ...payload,
        data: payload.data && sanitizeEntity(ability, payload.data),
      });
    });
  }

  private async sendNotificationToUser(payload: NotificationCreatedEvent) {
    let user = await this.usersService.findById(payload.userId);

    if (!user) {
      throw new Error('User not found');
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    console.log('typeof: ', typeof payload.data);
    console.log(
      'instanceof OrderEntity: ',
      payload.data instanceof OrderEntity,
    );

    this.notificationService.create(user, {
      ...payload,
      data: payload.data && sanitizeEntity(ability, payload.data),
    });
  }
}
