import { Test, TestingModule } from '@nestjs/testing';

import { PromProductsNormalizationServiceXml } from './prom-products-normalization-xml.service';

describe('PromProductsNormalizationServiceXml', () => {
  let service: PromProductsNormalizationServiceXml;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromProductsNormalizationServiceXml],
    }).compile();

    service = module.get<PromProductsNormalizationServiceXml>(
      PromProductsNormalizationServiceXml,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
