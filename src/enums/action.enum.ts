export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Confirm = 'confirm',
  // Orders
  Cancel = 'cancel',
  // Cart
  AddTo = 'addTo',
  RemoveFrom = 'removeFrom',
  // Requests
  Approve = 'approve',
  Decline = 'decline',
  Restore = 'restore',
  // Super
  SuperUpdate = 'superUpdate',
}
