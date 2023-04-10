import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductColorBadgeComponent } from './product-color-badge.component';

describe('ProductColorBadgeComponent', () => {
  let component: ProductColorBadgeComponent;
  let fixture: ComponentFixture<ProductColorBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductColorBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductColorBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
