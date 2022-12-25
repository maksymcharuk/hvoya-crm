import { mockUser } from '../entities/user.mock';

export const findOneBySpy: jest.Mock = jest.fn().mockResolvedValue(mockUser);
export const createSpy: jest.Mock = jest.fn().mockReturnValue(mockUser);
export const saveSpy: jest.Mock = jest.fn().mockReturnValue(mockUser);

export const userRepositoryMock = {
  findOneBy: findOneBySpy,
  create: createSpy,
  save: saveSpy,
};
