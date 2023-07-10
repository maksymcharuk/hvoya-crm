import { SHARED_BALANCE_READ_FIELDS } from '../shared/balance';

export const ANY_ADMIN_BALANCE_READ_FIELDS = [
  ...SHARED_BALANCE_READ_FIELDS,
  'paymentTransactions[].syncOneCStatus',
];
