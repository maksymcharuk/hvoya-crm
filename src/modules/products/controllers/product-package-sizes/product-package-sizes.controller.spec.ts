import { Test, TestingModule } from '@nestjs/testing';

import { ProductPackageSizesController } from './product-package-sizes.controller';

describe('ProductPackageSizesController', () => {
  let controller: ProductPackageSizesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPackageSizesController],
    }).compile();

    controller = module.get<ProductPackageSizesController>(
      ProductPackageSizesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
