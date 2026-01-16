import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@environment/environment';

import { AdminAnalyticsService } from './admin-analytics.service';

describe('AdminAnalyticsService', () => {
  let service: AdminAnalyticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminAnalyticsService],
    });

    service = TestBed.inject(AdminAnalyticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dropshippers analytics', () => {
    const mockResponse = {
      data: [
        {
          dropshipperId: '123',
          name: 'John Doe',
          email: 'john@example.com',
          ordersCount: 10,
          totalRevenue: 1000,
          averageOrderValue: 100,
          returnedAmount: 50,
          returnRate: 5,
          walletBalance: 500,
          lastOrderDate: null,
          lifetimeValue: 1000,
        },
      ],
      meta: {
        itemCount: 1,
        pageCount: 1,
        page: 1,
        take: 10,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    service
      .getDropshippersAnalytics({ from: new Date('2024-01-01') })
      .subscribe((result) => {
        expect(result.data.length).toBe(1);
        expect(result.data[0].name).toBe('John Doe');
      });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/analytics/admin/dropshippers'),
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch orders summary', () => {
    const mockResponse = {
      summary: {
        totalOrdersCount: 100,
        totalRevenue: 10000,
        averageOrderValue: 100,
        averageProcessingTime: 24,
        completedOrdersCount: 80,
        cancelledOrdersCount: 10,
        refundedOrdersCount: 5,
        refusedOrdersCount: 5,
      },
      funnel: {
        created: 100,
        paid: 95,
        processed: 80,
        returned: 5,
      },
    };

    service.getOrdersSummary().subscribe((result) => {
      expect(result.summary.totalOrdersCount).toBe(100);
      expect(result.funnel.created).toBe(100);
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/analytics/admin/orders/summary'),
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch products analytics', () => {
    const mockResponse = {
      data: [
        {
          productId: '123',
          productName: 'Test Product',
          quantitySold: 50,
          totalRevenue: 5000,
          uniqueDropshippersCount: 5,
          returnRate: 2,
          averagePrice: 100,
          minPrice: 80,
          maxPrice: 120,
        },
      ],
      meta: {
        itemCount: 1,
        pageCount: 1,
        page: 1,
        take: 10,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    service.getProductsAnalytics().subscribe((result) => {
      expect(result.data.length).toBe(1);
      expect(result.data[0].productName).toBe('Test Product');
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/analytics/admin/products'),
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
