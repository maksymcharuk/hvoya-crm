import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTypeBadgeComponent } from './request-type-badge.component';

describe('RequestTypeBadgeComponent', () => {
  let component: RequestTypeBadgeComponent;
  let fixture: ComponentFixture<RequestTypeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestTypeBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestTypeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
