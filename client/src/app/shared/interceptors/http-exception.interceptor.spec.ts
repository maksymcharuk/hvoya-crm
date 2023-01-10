import { TestBed } from '@angular/core/testing';

import { HttpExceptionInterceptor } from './http-exception.interceptor';

describe('HttpExceptionInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpExceptionInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: HttpExceptionInterceptor = TestBed.inject(
      HttpExceptionInterceptor,
    );
    expect(interceptor).toBeTruthy();
  });
});
