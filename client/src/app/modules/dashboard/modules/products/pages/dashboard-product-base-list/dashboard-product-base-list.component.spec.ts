import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProductBaseListComponent } from './dashboard-product-base-list.component';

describe('DashboardProductBaseListComponent', () => {
  let component: DashboardProductBaseListComponent;
  let fixture: ComponentFixture<DashboardProductBaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardProductBaseListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardProductBaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
