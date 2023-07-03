import { NotificationType } from '@shared/enums/notification-type.enum';

export const ORDER_NOTIFICATIONS = [
  NotificationType.OrderCreated,
  NotificationType.OrderCancelled,
  NotificationType.OrderStatusUpdated,
];

export const USER_NOTIFICATION = [
  NotificationType.UserCreated,
  NotificationType.UserConfirmed,
  NotificationType.AdminCreated,
];
