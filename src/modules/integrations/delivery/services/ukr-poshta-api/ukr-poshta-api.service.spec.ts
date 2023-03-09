import { Test, TestingModule } from '@nestjs/testing';

import { UkrPoshtaApiService } from './ukr-poshta-api.service';

describe('UkrPoshtaApiService', () => {
  let service: UkrPoshtaApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UkrPoshtaApiService],
    }).compile();

    service = module.get<UkrPoshtaApiService>(UkrPoshtaApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
