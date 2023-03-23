import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryServiceBadgeComponent } from './delivery-service-badge.component';

describe('DeliveryServiceBadgeComponent', () => {
  let component: DeliveryServiceBadgeComponent;
  let fixture: ComponentFixture<DeliveryServiceBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryServiceBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryServiceBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
