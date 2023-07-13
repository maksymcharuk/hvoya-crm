import { combine } from '../combine.util';
import { SHARED_ORDER_READ_FIELDS } from '../shared/order';
import { SHARED_USER_READ_FIELDS } from '../shared/user';

export const ANY_ADMIN_ORDER_READ_FIELDS = [
  ...SHARED_ORDER_READ_FIELDS,
  'id',
  'managerNote',
  'statuses[].comment',
  'statuses[].createdAt',
  ...combine('statuses[].createdBy', SHARED_USER_READ_FIELDS),
  ...combine('customer', SHARED_USER_READ_FIELDS),
];
