import { Test, TestingModule } from '@nestjs/testing';

import { DeliveryServiceFactory } from './delivery-service.factory';

describe('DeliveryServiceFactory', () => {
  let service: DeliveryServiceFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryServiceFactory],
    }).compile();

    service = module.get<DeliveryServiceFactory>(DeliveryServiceFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
