import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserEntity } from '@entities/user.entity';

import { mockUser } from '../../../../test/mocks/entities/user.mock';
import * as userReposityMock from '../../../../test/mocks/reposiories/user.repository.mock';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userReposityMock.userRepositoryMock,
        },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch user by id', async () => {
    const user = await service.findById(1);

    expect(userReposityMock.findOneBySpy).toHaveBeenCalledTimes(1);
    expect(user).toEqual(mockUser);
  });

  it('should fetch user by email', async () => {
    const user = await service.findByEmail('email');

    expect(userReposityMock.findOneBySpy).toHaveBeenCalledTimes(1);
    expect(user).toEqual(mockUser);
  });

  it('should fetch user and delete password', async () => {
    const findById = jest.spyOn(service, 'findById');
    const user = await service.showById(1);

    delete mockUser.password;

    expect(findById).toHaveBeenCalledTimes(1);
    expect(user).toEqual(mockUser);
  });

  it('should fetch user and delete password', async () => {
    const user = await service.create({
      email: 'email',
      password: 'password',
      firtName: 'firstName',
      lastName: 'lastName',
    });

    delete mockUser.password;

    expect(userReposityMock.createSpy).toHaveBeenCalledTimes(1);
    expect(userReposityMock.saveSpy).toHaveBeenCalledTimes(1);
    expect(user).toEqual(mockUser);
  });
});
