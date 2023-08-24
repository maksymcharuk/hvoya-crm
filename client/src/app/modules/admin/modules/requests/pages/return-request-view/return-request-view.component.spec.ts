import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestViewComponent } from './return-request-view.component';

describe('ReturnRequestViewComponent', () => {
  let component: ReturnRequestViewComponent;
  let fixture: ComponentFixture<ReturnRequestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnRequestViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
