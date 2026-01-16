import Decimal from 'decimal.js';

import { Test, TestingModule } from '@nestjs/testing';

import { OrderStatus } from '@enums/order-status.enum';

import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './services/analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  const mockAnalyticsService = {
    getUserDataForAdmins: jest.fn(),
    getOrderDataForAdmins: jest.fn(),
    getDropshippersAnalytics: jest.fn(),
    getOrdersSummary: jest.fn(),
    getOrdersByMonth: jest.fn(),
    getOrdersByStatus: jest.fn(),
    getProductsAnalytics: jest.fn(),
    getProductTimeline: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDropshippersAnalytics', () => {
    it('should call service and return dropshippers analytics', async () => {
      const query = {};
      const pageOptions = { page: 1, take: 10 };
      const expectedResult = {
        data: [
          {
            dropshipperId: '123',
            name: 'John Doe',
            ordersCount: 10,
            totalRevenue: new Decimal('1000'),
          },
        ],
        meta: { itemCount: 1, page: 1, pageCount: 1 },
      };

      mockAnalyticsService.getDropshippersAnalytics.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getDropshippersAnalytics(
        query,
        pageOptions,
      );

      expect(result).toEqual(expectedResult);
      expect(
        mockAnalyticsService.getDropshippersAnalytics,
      ).toHaveBeenCalledWith(query, pageOptions);
    });
  });

  describe('getOrdersSummary', () => {
    it('should call service and return orders summary', async () => {
      const query = {};
      const expectedResult = {
        summary: {
          totalOrdersCount: 100,
          totalRevenue: new Decimal('10000'),
          averageOrderValue: new Decimal('100'),
        },
        funnel: {
          created: 100,
          paid: 95,
          processed: 90,
          returned: 5,
        },
      };

      mockAnalyticsService.getOrdersSummary.mockResolvedValue(expectedResult);

      const result = await controller.getOrdersSummary(query);

      expect(result).toEqual(expectedResult);
      expect(mockAnalyticsService.getOrdersSummary).toHaveBeenCalledWith(query);
    });
  });

  describe('getOrdersByMonth', () => {
    it('should call service and return orders by month', async () => {
      const query = {};
      const pageOptions = { page: 1, take: 10 };
      const expectedResult = {
        data: [
          {
            month: '2024-01',
            ordersCount: 10,
            totalAmount: new Decimal('1000'),
          },
        ],
      };

      mockAnalyticsService.getOrdersByMonth.mockResolvedValue(expectedResult);

      const result = await controller.getOrdersByMonth(query, pageOptions);

      expect(result).toEqual(expectedResult);
      expect(mockAnalyticsService.getOrdersByMonth).toHaveBeenCalledWith(
        query,
        pageOptions,
      );
    });
  });

  describe('getOrdersByStatus', () => {
    it('should call service and return orders by status', async () => {
      const query = {};
      const expectedResult = {
        data: [
          {
            status: OrderStatus.Fulfilled,
            count: 80,
            percentage: 80,
          },
        ],
      };

      mockAnalyticsService.getOrdersByStatus.mockResolvedValue(expectedResult);

      const result = await controller.getOrdersByStatus(query);

      expect(result).toEqual(expectedResult);
      expect(mockAnalyticsService.getOrdersByStatus).toHaveBeenCalledWith(
        query,
      );
    });
  });

  describe('getProductsAnalytics', () => {
    it('should call service and return products analytics', async () => {
      const query = {};
      const pageOptions = { page: 1, take: 10 };
      const expectedResult = {
        data: [
          {
            productId: 'prod-123',
            productName: 'Test Product',
            quantitySold: 50,
            totalRevenue: new Decimal('5000'),
          },
        ],
        meta: { itemCount: 1, page: 1 },
      };

      mockAnalyticsService.getProductsAnalytics.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getProductsAnalytics(query, pageOptions);

      expect(result).toEqual(expectedResult);
      expect(mockAnalyticsService.getProductsAnalytics).toHaveBeenCalledWith(
        query,
        pageOptions,
      );
    });
  });

  describe('getProductTimeline', () => {
    it('should call service and return product timeline', async () => {
      const productId = 'prod-123';
      const query = {};
      const expectedResult = {
        productId,
        productName: 'Test Product',
        timeline: [
          {
            date: '2024-01-01',
            price: new Decimal('100'),
            ordersCount: 5,
          },
        ],
      };

      mockAnalyticsService.getProductTimeline.mockResolvedValue(expectedResult);

      const result = await controller.getProductTimeline(productId, query);

      expect(result).toEqual(expectedResult);
      expect(mockAnalyticsService.getProductTimeline).toHaveBeenCalledWith(
        productId,
        query,
      );
    });
  });
});
