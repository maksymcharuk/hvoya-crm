import { TestBed } from '@angular/core/testing';

import { ProductSizesService } from './product-sizes.service';

describe('ProductSizesService', () => {
  let service: ProductSizesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSizesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
