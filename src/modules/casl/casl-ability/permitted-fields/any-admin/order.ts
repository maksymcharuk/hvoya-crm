import { SHARED_ORDER_READ_FIELDS } from '../shared/order';

export const ANY_ADMIN_ORDER_READ_FIELDS = [
  ...SHARED_ORDER_READ_FIELDS,
  'managerNote',
  'statuses[].comment',
  'statuses[].createdAt',
  'statuses[].createdBy.firstName',
  'statuses[].createdBy.lastName',
  'statuses[].createdBy.middleName',
  'customer.firstName',
  'customer.lastName',
  'customer.middleName',
  'customer.phoneNumber',
];
