import { Test, TestingModule } from '@nestjs/testing';

import { ProductPackageSizesService } from './product-package-sizes.service';

describe('ProductPackageSizesService', () => {
  let service: ProductPackageSizesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPackageSizesService],
    }).compile();

    service = module.get<ProductPackageSizesService>(
      ProductPackageSizesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
