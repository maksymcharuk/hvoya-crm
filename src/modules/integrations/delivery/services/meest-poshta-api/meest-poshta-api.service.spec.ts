import { Test, TestingModule } from '@nestjs/testing';

import { MeestPoshtaApiService } from './meest-poshta-api.service';

describe('MeestPoshtaApiService', () => {
  let service: MeestPoshtaApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeestPoshtaApiService],
    }).compile();

    service = module.get<MeestPoshtaApiService>(MeestPoshtaApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
