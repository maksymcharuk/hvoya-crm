import { TestBed } from '@angular/core/testing';

import { ProductColorsService } from './product-colors.service';

describe('ProductColorsService', () => {
  let service: ProductColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
