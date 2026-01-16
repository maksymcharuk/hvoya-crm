import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { of } from 'rxjs';

import { CurrencyPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

import { TopProductsChartComponent } from './top-products-chart.component';

describe('TopProductsChartComponent', () => {
  let component: TopProductsChartComponent;
  let fixture: ComponentFixture<TopProductsChartComponent>;
  let analyticsService: jasmine.SpyObj<AdminAnalyticsService>;

  beforeEach(async () => {
    const analyticsServiceSpy = jasmine.createSpyObj('AdminAnalyticsService', [
      'getProductsAnalytics',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TopProductsChartComponent],
      imports: [
        ReactiveFormsModule,
        CalendarModule,
        ChartModule,
        SkeletonModule,
      ],
      providers: [
        { provide: AdminAnalyticsService, useValue: analyticsServiceSpy },
        CurrencyPipe,
      ],
    }).compileComponents();

    analyticsService = TestBed.inject(
      AdminAnalyticsService,
    ) as jasmine.SpyObj<AdminAnalyticsService>;
    fixture = TestBed.createComponent(TopProductsChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
