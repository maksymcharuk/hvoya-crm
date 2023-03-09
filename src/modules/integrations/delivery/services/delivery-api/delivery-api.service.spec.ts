import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryApiService } from './delivery-api.service';

describe('DeliveryApiService', () => {
  let service: DeliveryApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryApiService],
    }).compile();

    service = module.get<DeliveryApiService>(DeliveryApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
