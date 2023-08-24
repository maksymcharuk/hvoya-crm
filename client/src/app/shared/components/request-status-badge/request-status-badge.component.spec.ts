import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusBadgeComponent } from './request-status-badge.component';

describe('RequestStatusBadgeComponent', () => {
  let component: RequestStatusBadgeComponent;
  let fixture: ComponentFixture<RequestStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestStatusBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
