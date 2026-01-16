import { CalendarModule } from 'primeng/calendar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';

import { CurrencyPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

import { ProductsAnalyticsComponent } from './products-analytics.component';

describe('ProductsAnalyticsComponent', () => {
  let component: ProductsAnalyticsComponent;
  let fixture: ComponentFixture<ProductsAnalyticsComponent>;
  let analyticsService: jasmine.SpyObj<AdminAnalyticsService>;

  beforeEach(async () => {
    const analyticsServiceSpy = jasmine.createSpyObj('AdminAnalyticsService', [
      'getProductsAnalytics',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ProductsAnalyticsComponent],
      imports: [
        ReactiveFormsModule,
        TableModule,
        CalendarModule,
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
    fixture = TestBed.createComponent(ProductsAnalyticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format currency correctly', () => {
    const result = component.formatCurrency(1000);
    expect(result).toContain('1');
  });

  it('should format percentage correctly', () => {
    const result = component.formatPercent(5.678);
    expect(result).toBe('5.68%');
  });
});
