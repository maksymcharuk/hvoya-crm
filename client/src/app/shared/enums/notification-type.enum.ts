export enum NotificationType {
  Info = 'info',

  UserCreated = 'user.created',
  UserConfirmed = 'user.confirmed',

  AdminCreated = 'admin.created',

  OrderCreated = 'order.created',
  OrderCancelled = 'order.cancelled',
  OrderStatusUpdated = 'order.status.updated',

  RequestCreated = 'request.created',
  RequestApproved = 'request.approved',
}
