import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartWidgetItemComponent } from './cart-widget-item.component';

describe('CartWidgetItemComponent', () => {
  let component: CartWidgetItemComponent;
  let fixture: ComponentFixture<CartWidgetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartWidgetItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartWidgetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
