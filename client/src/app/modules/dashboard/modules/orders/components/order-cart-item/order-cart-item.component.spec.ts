import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCartItemComponent } from './order-cart-item.component';

describe('OrderCartItemComponent', () => {
  let component: OrderCartItemComponent;
  let fixture: ComponentFixture<OrderCartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCartItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
