import { Test, TestingModule } from '@nestjs/testing';
import { ReturnRequestController } from './return-request.controller';

describe('ReturnRequestController', () => {
  let controller: ReturnRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnRequestController],
    }).compile();

    controller = module.get<ReturnRequestController>(ReturnRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
