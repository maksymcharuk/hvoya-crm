import { Test, TestingModule } from '@nestjs/testing';

import { PromProductsNormalizationServiceXls } from './prom-products-normalization-xls.service';

describe('PromProductsNormalizationServiceXls', () => {
  let service: PromProductsNormalizationServiceXls;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromProductsNormalizationServiceXls],
    }).compile();

    service = module.get<PromProductsNormalizationServiceXls>(
      PromProductsNormalizationServiceXls,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
