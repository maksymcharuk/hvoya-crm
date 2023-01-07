import { TestBed } from '@angular/core/testing';

import { PoliciesGuard } from './policies.guard';

describe('PoliciesGuard', () => {
  let guard: PoliciesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PoliciesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
