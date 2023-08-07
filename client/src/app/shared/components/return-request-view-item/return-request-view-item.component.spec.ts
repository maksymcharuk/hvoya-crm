import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestViewItemComponent } from './return-request-view-item.component';

describe('ReturnRequestViewItemComponent', () => {
  let component: ReturnRequestViewItemComponent;
  let fixture: ComponentFixture<ReturnRequestViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnRequestViewItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRequestViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
