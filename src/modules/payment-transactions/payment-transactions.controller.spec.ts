import { Test, TestingModule } from '@nestjs/testing';

import { PaymentTransactionsController } from './payment-transactions.controller';

describe('PaymentTransactionsController', () => {
  let controller: PaymentTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentTransactionsController],
    }).compile();

    controller = module.get<PaymentTransactionsController>(
      PaymentTransactionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
