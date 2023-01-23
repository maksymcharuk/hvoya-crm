import { Test, TestingModule } from '@nestjs/testing';

import { caslAbilityFactoryMock } from '../../../test/mocks/factories/casl-ability.factory';
import { CaslAbilityFactory } from '../casl/casl-ability/casl-ability.factory';
import { AccountController } from './account.controller';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        { provide: CaslAbilityFactory, useValue: caslAbilityFactoryMock },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
