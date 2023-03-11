import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductColorsTableComponent } from './product-colors.component';

describe('ProductColorsTableComponent', () => {
  let component: ProductColorsTableComponent;
  let fixture: ComponentFixture<ProductColorsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductColorsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductColorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
