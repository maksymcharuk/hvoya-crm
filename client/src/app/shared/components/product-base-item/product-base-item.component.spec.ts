import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBaseItemComponent } from './product-base-item.component';

describe('ProductBaseItemComponent', () => {
  let component: ProductBaseItemComponent;
  let fixture: ComponentFixture<ProductBaseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductBaseItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductBaseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
