import { Test, TestingModule } from '@nestjs/testing';

import { ReturnRequestsStrategy } from './return-requests.strategy';

describe('ReturnRequestsStrategy', () => {
  let service: ReturnRequestsStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnRequestsStrategy],
    }).compile();

    service = module.get<ReturnRequestsStrategy>(ReturnRequestsStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
