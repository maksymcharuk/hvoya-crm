import { mockUser } from '../entities/user.mock';

export const createSpy: jest.Mock = jest.fn().mockReturnValue(mockUser);
export const showByIdSpy: jest.Mock = jest.fn().mockResolvedValue(mockUser);
export const findByIdSpy: jest.Mock = jest.fn().mockResolvedValue(mockUser);
export const findByEmailSpy: jest.Mock = jest.fn().mockResolvedValue(mockUser);
export const saveSpy: jest.Mock = jest.fn().mockReturnValue(mockUser);

export const usersServiceMock = {
  create: createSpy,
  showById: showByIdSpy,
  findById: findByIdSpy,
  findByEmail: findByEmailSpy,
  sanitizeUser: jest.fn(),
};
