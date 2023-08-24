export enum NotificationEvent {
  UserCreated = 'notification.user.created',
  UserConfirmed = 'notification.user.confirmed',

  OrderCreated = 'notification.order.created',
  OrderUpdated = 'notification.order.updated',
  OrderCancelled = 'notification.order.cancelled',

  RequestCreated = 'notification.request.created',
  RequestRejected = 'notification.request.rejected',
  RequestApproved = 'notification.request.approved',
}
