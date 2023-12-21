import { combine } from '../combine.util';
import { SHARED_POST_READ_FIELDS } from '../shared/post';
import { ANY_ADMIN_USER_READ_FIELDS } from './user';

export const ANY_ADMIN_POST_READ_FIELDS = [
  'id',
  'createdAt',
  ...combine('createdBy', ANY_ADMIN_USER_READ_FIELDS),
  ...combine('updatedBy', ANY_ADMIN_USER_READ_FIELDS),
  ...SHARED_POST_READ_FIELDS,
];
