import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProductsComponent } from './dashboard-products.component';

describe('DashboardProductsComponent', () => {
  let component: DashboardProductsComponent;
  let fixture: ComponentFixture<DashboardProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
