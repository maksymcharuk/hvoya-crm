import { combine } from '../combine.util';
import { SHARED_BALANCE_READ_FIELDS } from './balance';
import { SHARED_ORDER_READ_FIELDS } from './order';

export const SHARED_PAYMENT_TRANSACTION_READ_FIELDS = [
  'amount',
  'status',
  'orderReturnRequest',
  'createdAt',
  ...combine('order', SHARED_ORDER_READ_FIELDS),
  ...combine('balance', SHARED_BALANCE_READ_FIELDS),
];
