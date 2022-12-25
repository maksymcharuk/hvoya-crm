import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { mockUser } from '../../../../test/mocks/user.mock';

import { UserEntity } from '../../../entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let findOneBySpy: jest.Mock;
  let createSpy: jest.Mock;
  let saveSpy: jest.Mock;

  beforeEach(async () => {
    findOneBySpy = jest.fn().mockResolvedValue(mockUser);
    createSpy = jest.fn().mockReturnValue(mockUser);
    saveSpy = jest.fn().mockReturnValue(mockUser);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: findOneBySpy,
            create: createSpy,
            save: saveSpy,
          },
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch user by id', async () => {
    const user = await service.findById(1);

    expect(findOneBySpy).toHaveBeenCalledTimes(1);
    expect(user).toEqual(mockUser);
  });

  it('should fetch user by email', async () => {
    const user = await service.findByEmail('email');

    expect(findOneBySpy).toHaveBeenCalledTimes(1);
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

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(user).toEqual(mockUser);
  });
});
