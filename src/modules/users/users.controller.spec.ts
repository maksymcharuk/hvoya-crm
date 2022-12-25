import { Test, TestingModule } from '@nestjs/testing';

import { usersServiceMock } from '../../../test/mocks/services/users.service.mock';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
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
    usersServiceMock.findById.mockImplementation(() => userMock);

    const user = await controller.getUserById('1');

    expect(usersServiceMock.findById).toHaveBeenCalledTimes(1);
    expect(user).toEqual(userMock);
  });
});
