import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestDeliveryStatusBadgeComponent } from './return-request-delivery-status-badge.component';

describe('ReturnRequestDeliveryStatusBadgeComponent', () => {
  let component: ReturnRequestDeliveryStatusBadgeComponent;
  let fixture: ComponentFixture<ReturnRequestDeliveryStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnRequestDeliveryStatusBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRequestDeliveryStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
