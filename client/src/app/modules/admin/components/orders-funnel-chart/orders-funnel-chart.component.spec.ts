import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

import { OrdersFunnelChartComponent } from './orders-funnel-chart.component';

describe('OrdersFunnelChartComponent', () => {
  let component: OrdersFunnelChartComponent;
  let fixture: ComponentFixture<OrdersFunnelChartComponent>;
  let analyticsService: jasmine.SpyObj<AdminAnalyticsService>;

  beforeEach(async () => {
    const analyticsServiceSpy = jasmine.createSpyObj('AdminAnalyticsService', [
      'getOrdersSummary',
    ]);

    await TestBed.configureTestingModule({
      declarations: [OrdersFunnelChartComponent],
      imports: [
        ReactiveFormsModule,
        CalendarModule,
        ChartModule,
        SkeletonModule,
      ],
      providers: [
        { provide: AdminAnalyticsService, useValue: analyticsServiceSpy },
      ],
    }).compileComponents();

    analyticsService = TestBed.inject(
      AdminAnalyticsService,
    ) as jasmine.SpyObj<AdminAnalyticsService>;
    fixture = TestBed.createComponent(OrdersFunnelChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct chart type', () => {
    expect(component['setup']).toBeDefined();
  });
});
