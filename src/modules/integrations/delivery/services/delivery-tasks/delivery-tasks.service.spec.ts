import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryTasksService } from './delivery-tasks.service';

describe('DeliveryTasksService', () => {
  let service: DeliveryTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryTasksService],
    }).compile();

    service = module.get<DeliveryTasksService>(DeliveryTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
