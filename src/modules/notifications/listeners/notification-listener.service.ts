import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationCreatedEvent } from '@interfaces/notifications/notification-created.interface';

import { UsersService } from '../../../modules/users/services/users.service';
import { NotificationService } from '../services/notification/notification.service';

@Injectable()
export class NotificationListenerService {
  constructor(
    private usersService: UsersService,
    private notificationService: NotificationService,
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

  private async sendNotificationToAdmins(payload: NotificationCreatedEvent) {
    let adminUsers = await this.usersService.getAllAdmins();
    console.log(adminUsers);

    adminUsers.forEach((user) => {
      this.notificationService.create(user, payload);
    });
  }

  private async sendNotificationToUser(payload: NotificationCreatedEvent) {
    let user = await this.usersService.findById(payload.userId);

    if (!user) {
      throw new Error('User not found');
    }

    this.notificationService.create(user, payload);
  }
}
