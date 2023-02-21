import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusBadgeComponent } from './order-status-badge.component';

describe('OrderStatusBadgeComponent', () => {
  let component: OrderStatusBadgeComponent;
  let fixture: ComponentFixture<OrderStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderStatusBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
