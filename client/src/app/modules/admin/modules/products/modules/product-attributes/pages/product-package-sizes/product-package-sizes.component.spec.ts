import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPackageSizesComponent } from './product-package-sizes.component';

describe('ProductPackageSizesComponent', () => {
  let component: ProductPackageSizesComponent;
  let fixture: ComponentFixture<ProductPackageSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductPackageSizesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPackageSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
