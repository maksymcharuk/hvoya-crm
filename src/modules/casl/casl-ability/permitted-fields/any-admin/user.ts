import { combine } from '../combine.util';
import { SHARED_ORDER_READ_FIELDS } from '../shared/order';
import { SHARED_USER_READ_FIELDS } from '../shared/user';
import { ANY_ADMIN_BALANCE_READ_FIELDS } from './balance';

export const ANY_ADMIN_USER_READ_FIELDS = [
  ...SHARED_USER_READ_FIELDS,
  'id',
  'note',
  ...combine('manager', SHARED_USER_READ_FIELDS),
  ...combine('balance', ANY_ADMIN_BALANCE_READ_FIELDS),
  ...combine('managedUsers[]', SHARED_USER_READ_FIELDS),
  ...combine('orders[]', SHARED_ORDER_READ_FIELDS),
];

export const ANY_ADMIN_USER_WRITE_FIELDS = ['note'];
