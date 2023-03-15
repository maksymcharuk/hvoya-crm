import { TestBed } from '@angular/core/testing';

import { UserBalanceService } from './user-balance.service';

describe('UserBalanceService', () => {
  let service: UserBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
