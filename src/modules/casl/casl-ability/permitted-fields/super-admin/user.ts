import {
  ANY_ADMIN_USER_READ_FIELDS,
  ANY_ADMIN_USER_WRITE_FIELDS,
} from '../any-admin/user';

export const SUPER_ADMIN_USER_READ_FIELDS = [...ANY_ADMIN_USER_READ_FIELDS];
export const SUPER_ADMIN_USER_WRITE_FIELDS = [
  ...ANY_ADMIN_USER_WRITE_FIELDS,
  'manager',
];
