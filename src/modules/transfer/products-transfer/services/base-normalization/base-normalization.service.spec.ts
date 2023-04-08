import { Test, TestingModule } from '@nestjs/testing';
import { BaseNormalizationService } from './base-normalization.service';

describe('BaseNormalizationService', () => {
  let service: BaseNormalizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseNormalizationService],
    }).compile();

    service = module.get<BaseNormalizationService>(BaseNormalizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
