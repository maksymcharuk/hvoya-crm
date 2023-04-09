import { TestBed } from '@angular/core/testing';

import { ProductsTransferService } from './products-transfer.service';

describe('ProductsTransferService', () => {
  let service: ProductsTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
