import { NotificationType } from '@shared/enums/notification-type.enum';

export const ORDER_NOTIFICATIONS = [
  NotificationType.OrderCreated,
  NotificationType.OrderStatusUpdated,
];

export const USER_NOTIFICATION = [
  NotificationType.UserCreated,
  NotificationType.UserConfirmed,
  NotificationType.AdminCreated,
];
