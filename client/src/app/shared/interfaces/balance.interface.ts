import { PaymentTransaction } from "./ payment-transaction.interface";

export interface Balance {
  amount: number;
  paymentTransactions: PaymentTransaction[];
}
