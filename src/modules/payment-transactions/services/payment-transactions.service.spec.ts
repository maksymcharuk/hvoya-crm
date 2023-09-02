import { Test, TestingModule } from '@nestjs/testing';

import { PaymentTransactionsService } from './payment-transactions.service';

describe('PaymentTransactionsService', () => {
  let service: PaymentTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentTransactionsService],
    }).compile();

    service = module.get<PaymentTransactionsService>(
      PaymentTransactionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
