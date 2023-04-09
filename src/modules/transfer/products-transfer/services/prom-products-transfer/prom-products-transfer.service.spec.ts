import { Test, TestingModule } from '@nestjs/testing';
import { PromProductsTransferService } from './prom-products-transfer.service';

describe('PromProductsTransferService', () => {
  let service: PromProductsTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromProductsTransferService],
    }).compile();

    service = module.get<PromProductsTransferService>(PromProductsTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
