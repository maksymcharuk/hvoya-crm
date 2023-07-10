import { Test, TestingModule } from '@nestjs/testing';
import { ReturnRequestService } from './return-request.service';

describe('ReturnRequestService', () => {
  let service: ReturnRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnRequestService],
    }).compile();

    service = module.get<ReturnRequestService>(ReturnRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
