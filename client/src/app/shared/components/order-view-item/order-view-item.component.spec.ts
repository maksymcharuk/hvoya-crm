import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderViewItemComponent } from './order-view-item.component';

describe('OrderViewItemComponent', () => {
  let component: OrderViewItemComponent;
  let fixture: ComponentFixture<OrderViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderViewItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
