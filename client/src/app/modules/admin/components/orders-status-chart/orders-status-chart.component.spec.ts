import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

import { OrdersStatusChartComponent } from './orders-status-chart.component';

describe('OrdersStatusChartComponent', () => {
  let component: OrdersStatusChartComponent;
  let fixture: ComponentFixture<OrdersStatusChartComponent>;
  let analyticsService: jasmine.SpyObj<AdminAnalyticsService>;

  beforeEach(async () => {
    const analyticsServiceSpy = jasmine.createSpyObj('AdminAnalyticsService', [
      'getOrdersByStatus',
    ]);

    await TestBed.configureTestingModule({
      declarations: [OrdersStatusChartComponent],
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
    fixture = TestBed.createComponent(OrdersStatusChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
