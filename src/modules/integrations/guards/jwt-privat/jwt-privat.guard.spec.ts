import { JwtPrivatGuard } from './jwt-privat.guard';

describe('JwtPrivatGuard', () => {
  it('should be defined', () => {
    expect(new JwtPrivatGuard()).toBeDefined();
  });
});
