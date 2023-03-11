import { Test, TestingModule } from '@nestjs/testing';
import { ProductColorsController } from './product-colors.controller';

describe('ProductColorsController', () => {
  let controller: ProductColorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductColorsController],
    }).compile();

    controller = module.get<ProductColorsController>(ProductColorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
