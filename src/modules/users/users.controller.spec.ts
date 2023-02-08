import { Test, TestingModule } from '@nestjs/testing';

import { caslAbilityFactoryMock } from '../../../test/mocks/factories/casl-ability.factory';
import { usersServiceMock } from '../../../test/mocks/services/users.service.mock';
import { CaslAbilityFactory } from '../casl/casl-ability/casl-ability.factory';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: CaslAbilityFactory, useValue: caslAbilityFactoryMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const userMock = { id: 1, email: 'email', password: 'password' };
    usersServiceMock.create.mockImplementation(() => userMock);

    const user = await controller.createUser(userMock);

    expect(usersServiceMock.create).toHaveBeenCalledTimes(1);
    expect(user).toEqual(userMock);
  });

  it('should fetch user by id', async () => {
    const userMock = { id: 1, email: 'email', password: 'password' };
    usersServiceMock.showById.mockImplementation(() => userMock);

    const user = await controller.getUserById(1);

    delete userMock.password;

    expect(usersServiceMock.showById).toHaveBeenCalledTimes(1);
    expect(user).toEqual(userMock);
  });
});
