import { Test, TestingModule } from '@nestjs/testing';

import { FundsWithdrawRequestsStrategy } from './funds-withdraw-requests.strategy';

describe('FundsWithdrawRequestsStrategy', () => {
  let service: FundsWithdrawRequestsStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundsWithdrawRequestsStrategy],
    }).compile();

    service = module.get<FundsWithdrawRequestsStrategy>(
      FundsWithdrawRequestsStrategy,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
