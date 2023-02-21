import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeliveryStatusBadgeComponent } from './order-delivery-status-badge.component';

describe('OrderDeliveryStatusBadgeComponent', () => {
  let component: OrderDeliveryStatusBadgeComponent;
  let fixture: ComponentFixture<OrderDeliveryStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDeliveryStatusBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDeliveryStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
