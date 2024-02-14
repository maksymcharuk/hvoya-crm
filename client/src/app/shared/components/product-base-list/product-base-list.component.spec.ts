import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBaseListComponent } from './product-base-list.component';

describe('ProductBaseListComponent', () => {
  let component: ProductBaseListComponent;
  let fixture: ComponentFixture<ProductBaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductBaseListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductBaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
