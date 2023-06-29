import { Test, TestingModule } from '@nestjs/testing';

import { OneCApiClientService } from './one-c-api-client.service';

describe('OneCApiClientService', () => {
  let service: OneCApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OneCApiClientService],
    }).compile();

    service = module.get<OneCApiClientService>(OneCApiClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
