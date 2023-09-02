import { SHARED_PAYMENT_TRANSACTION_READ_FIELDS } from '../shared/payment-transaction';

export const ANY_ADMIN_PAYMENT_TRANSACTION_READ_FIELDS = [
  ...SHARED_PAYMENT_TRANSACTION_READ_FIELDS,
  'syncOneCStatus',
];
