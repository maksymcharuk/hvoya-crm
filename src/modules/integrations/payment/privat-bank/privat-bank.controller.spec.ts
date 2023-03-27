import { Test, TestingModule } from '@nestjs/testing';

import { PrivatBankController } from './privat-bank.controller';

describe('PrivatBankController', () => {
  let controller: PrivatBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivatBankController],
    }).compile();

    controller = module.get<PrivatBankController>(PrivatBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
