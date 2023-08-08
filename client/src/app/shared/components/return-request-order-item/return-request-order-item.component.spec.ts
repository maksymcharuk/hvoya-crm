import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestOrderItemComponent } from './return-request-order-item.component';

describe('ReturnRequestOrderItemComponent', () => {
  let component: ReturnRequestOrderItemComponent;
  let fixture: ComponentFixture<ReturnRequestOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnRequestOrderItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRequestOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
