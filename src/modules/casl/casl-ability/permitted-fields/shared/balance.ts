import { combine } from '../combine.util';
import { SHARED_ORDER_READ_FIELDS } from './order';

export const SHARED_BALANCE_READ_FIELDS = [
  'amount',
  'paymentTransactions[].amount',
  'paymentTransactions[].createdAt',
  ...combine('paymentTransactions[].order', SHARED_ORDER_READ_FIELDS),
  'paymentTransactions[].status',
];
