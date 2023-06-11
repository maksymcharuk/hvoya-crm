import { Test, TestingModule } from '@nestjs/testing';

import { OneCSyncService } from './one-c-sync.service';

describe('OneCSyncService', () => {
  let service: OneCSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OneCSyncService],
    }).compile();

    service = module.get<OneCSyncService>(OneCSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
