import { Test, TestingModule } from '@nestjs/testing';
import { ProductsTransferController } from './products-transfer.controller';

describe('ProductsTransferController', () => {
  let controller: ProductsTransferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsTransferController],
    }).compile();

    controller = module.get<ProductsTransferController>(ProductsTransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
