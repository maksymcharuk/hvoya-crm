import { Test, TestingModule } from '@nestjs/testing';
import { NovaPoshtaApiService } from './nova-poshta-api.service';

describe('NovaPoshtaApiService', () => {
  let service: NovaPoshtaApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NovaPoshtaApiService],
    }).compile();

    service = module.get<NovaPoshtaApiService>(NovaPoshtaApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
