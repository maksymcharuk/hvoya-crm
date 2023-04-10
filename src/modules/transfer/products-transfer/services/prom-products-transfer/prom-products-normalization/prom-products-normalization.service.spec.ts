import { Test, TestingModule } from '@nestjs/testing';

import { PromProductsNormalizationService } from './prom-products-normalization.service';

describe('PromProductsNormalizationService', () => {
  let service: PromProductsNormalizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromProductsNormalizationService],
    }).compile();

    service = module.get<PromProductsNormalizationService>(
      PromProductsNormalizationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
