import { Test, TestingModule } from '@nestjs/testing';
import { ProductsCreationService } from './products-creation.service';

describe('ProductsCreationService', () => {
  let service: ProductsCreationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsCreationService],
    }).compile();

    service = module.get<ProductsCreationService>(ProductsCreationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
