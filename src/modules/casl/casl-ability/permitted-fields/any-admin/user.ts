import { combine } from '../combine.util';
import { SHARED_USER_READ_FIELDS } from '../shared/user';

export const ANY_ADMIN_USER_READ_FIELDS = [
  ...SHARED_USER_READ_FIELDS,
  'note',
  'manager.firstName',
  'manager.lastName',
  'manager.middleName',
  ...combine('managedUsers[]', SHARED_USER_READ_FIELDS),
];
