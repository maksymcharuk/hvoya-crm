import { combine } from '../combine.util';
import { SHARED_BALANCE_READ_FIELDS } from '../shared/balance';
import { SHARED_ORDER_READ_FIELDS } from '../shared/order';
import { SHARED_USER_READ_FIELDS } from '../shared/user';

export const ANY_ADMIN_USER_READ_FIELDS = [
  ...SHARED_USER_READ_FIELDS,
  'note',
  'manager.firstName',
  'manager.lastName',
  'manager.middleName',
  ...combine('balance', SHARED_BALANCE_READ_FIELDS),
  ...combine('managedUsers[]', SHARED_USER_READ_FIELDS),
  ...combine('orders[]', SHARED_ORDER_READ_FIELDS),
];

export const ANY_ADMIN_USER_WRITE_FIELDS = ['note'];
