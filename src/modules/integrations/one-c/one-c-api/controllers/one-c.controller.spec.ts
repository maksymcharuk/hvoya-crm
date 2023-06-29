import { Test, TestingModule } from '@nestjs/testing';

import { OneCController } from './one-c.controller';

describe('OneCController', () => {
  let controller: OneCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OneCController],
    }).compile();

    controller = module.get<OneCController>(OneCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
