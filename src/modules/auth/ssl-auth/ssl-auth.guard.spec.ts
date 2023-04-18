import { SslAuthGuard } from './ssl-auth.guard';

describe('SslAuthGuard', () => {
  it('should be defined', () => {
    expect(new SslAuthGuard()).toBeDefined();
  });
});
