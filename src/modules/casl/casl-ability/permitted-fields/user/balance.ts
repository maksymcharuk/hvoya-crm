import { combine } from '../combine.util';
import { USER_ORDER_READ_FIELDS } from './order';

export const USER_BALANCE_READ_FIELDS = [
  'amount',
  'paymentTransactions[].amount',
  'paymentTransactions[].createdAt',
  ...combine('paymentTransactions[].order', USER_ORDER_READ_FIELDS),
  'paymentTransactions[].status',
];
