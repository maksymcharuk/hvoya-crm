import { Test, TestingModule } from '@nestjs/testing';
import { ProductSizesController } from './product-sizes.controller';

describe('ProductSizesController', () => {
  let controller: ProductSizesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSizesController],
    }).compile();

    controller = module.get<ProductSizesController>(ProductSizesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
