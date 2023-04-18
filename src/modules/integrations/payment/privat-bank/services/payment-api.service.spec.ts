import { Test, TestingModule } from '@nestjs/testing';
import { PaymentApiService } from './payment-api.service';

describe('PaymentApiService', () => {
  let service: PaymentApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentApiService],
    }).compile();

    service = module.get<PaymentApiService>(PaymentApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
