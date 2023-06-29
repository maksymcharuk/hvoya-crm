import { Test, TestingModule } from '@nestjs/testing';

import { OneCApiService } from './one-c-api.service';

describe('OneCApiService', () => {
  let service: OneCApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OneCApiService],
    }).compile();

    service = module.get<OneCApiService>(OneCApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
