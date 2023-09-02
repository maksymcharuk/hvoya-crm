import { TestBed } from '@angular/core/testing';

import { PaymentTransactionsService } from './payment-transactions.service';

describe('PaymentTransactionsService', () => {
  let service: PaymentTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
