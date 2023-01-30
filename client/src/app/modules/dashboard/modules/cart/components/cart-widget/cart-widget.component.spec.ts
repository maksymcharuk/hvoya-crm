import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartWidgetComponent } from './cart-widget.component';

describe('CartWidgetComponent', () => {
  let component: CartWidgetComponent;
  let fixture: ComponentFixture<CartWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
