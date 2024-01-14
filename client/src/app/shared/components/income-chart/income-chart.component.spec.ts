import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeChartComponent } from './income-chart.component';

describe('IncomeChartComponent', () => {
  let component: IncomeChartComponent;
  let fixture: ComponentFixture<IncomeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomeChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
