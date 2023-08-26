export enum NotificationType {
  Info = 'info',

  UserCreated = 'user.created',
  UserConfirmed = 'user.confirmed',
  UserDeleted = 'user.deleted',

  AdminCreated = 'admin.created',

  OrderCreated = 'order.created',
  OrderCancelled = 'order.cancelled',
  OrderStatusUpdated = 'order.status.updated',

  RequestCreated = 'request.created',
  RequestRejected = 'request.rejected',
  RequestApproved = 'request.approved',
}
