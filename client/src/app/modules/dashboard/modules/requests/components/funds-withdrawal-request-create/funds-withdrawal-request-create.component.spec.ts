import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestCreateComponent } from './return-request-create.component';

describe('ReturnRequestCreateComponent', () => {
  let component: ReturnRequestCreateComponent;
  let fixture: ComponentFixture<ReturnRequestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnRequestCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
