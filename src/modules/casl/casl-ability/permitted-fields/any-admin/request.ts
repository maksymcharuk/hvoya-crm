import { SHARED_REQUEST_READ_FIELDS } from '../shared/request';

export const ANY_ADMIN_REQUEST_READ_FIELDS = [
  ...SHARED_REQUEST_READ_FIELDS,
  'managerComment',
];
