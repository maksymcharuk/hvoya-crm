import Decimal from 'decimal.js';
import { DataSource } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { OrderStatus } from '@enums/order-status.enum';
import { Role } from '@enums/role.enum';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { UsersService } from '@modules/users/services/users.service';

import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockDataSource = {
    manager: {
      createQueryBuilder: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    },
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  const mockCaslAbilityFactory = {
    createForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CaslAbilityFactory,
          useValue: mockCaslAbilityFactory,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDropshippersAnalytics', () => {
    it('should return paginated dropshippers analytics', async () => {
      const mockQuery = {
        getDateRange: jest
          .fn()
          .mockReturnValue([new Date('2024-01-01'), new Date('2024-12-31')]),
      };
      const pageOptions = {
        page: 1,
        take: 10,
        skip: 0,
        orderBy: 'totalRevenue',
        order: 'DESC',
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            dropshipperId: '123',
            name: 'John Doe',
            email: 'john@example.com',
            ordersCount: '10',
            totalRevenue: '1000',
            averageOrderValue: '100',
            returnedAmount: '100',
            walletBalance: '500',
            lastOrderDate: new Date('2024-12-01'),
            lifetimeValue: '1000',
          },
        ]),
      };

      const countQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '1' }),
      };

      mockDataSource.manager.createQueryBuilder
        .mockReturnValueOnce(mockQueryBuilder)
        .mockReturnValueOnce(countQueryBuilder);

      const result = await service.getDropshippersAnalytics(
        mockQuery,
        pageOptions,
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0].dropshipperId).toBe('123');
      expect(result.data[0].name).toBe('John Doe');
      expect(result.data[0].ordersCount).toBe(10);
      expect(result.meta.itemCount).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should handle no results gracefully', async () => {
      const mockQuery = {
        getDateRange: jest
          .fn()
          .mockReturnValue([new Date('2024-01-01'), new Date('2024-12-31')]),
      };
      const pageOptions = {
        page: 1,
        take: 10,
        skip: 0,
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      const countQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '0' }),
      };

      mockDataSource.manager.createQueryBuilder
        .mockReturnValueOnce(mockQueryBuilder)
        .mockReturnValueOnce(countQueryBuilder);

      const result = await service.getDropshippersAnalytics(
        mockQuery,
        pageOptions,
      );

      expect(result.data).toHaveLength(0);
      expect(result.meta.itemCount).toBe(0);
    });
  });

  describe('getOrdersSummary', () => {
    it('should return orders summary with funnel data', async () => {
      const mockQuery = {
        getDateRange: jest
          .fn()
          .mockReturnValue([new Date('2024-01-01'), new Date('2024-12-31')]),
      };

      const summaryQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          totalOrdersCount: '100',
          totalRevenue: '10000',
          averageOrderValue: '100',
          averageProcessingTime: '24',
        }),
      };

      const statusQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { status: OrderStatus.Fulfilled, count: '80' },
          { status: OrderStatus.Cancelled, count: '10' },
          { status: OrderStatus.Refunded, count: '5' },
        ]),
      };

      const returnedQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '5' }),
      };

      mockDataSource.manager.createQueryBuilder
        .mockReturnValueOnce(summaryQueryBuilder)
        .mockReturnValueOnce(statusQueryBuilder)
        .mockReturnValueOnce(returnedQueryBuilder);

      const result = await service.getOrdersSummary(mockQuery);

      expect(result.summary.totalOrdersCount).toBe(100);
      expect(result.summary.totalRevenue).toEqual(new Decimal('10000'));
      expect(result.funnel.created).toBe(100);
      expect(result.funnel.processed).toBe(80);
      expect(result.funnel.returned).toBe(5);
    });
  });

  describe('getOrdersByMonth', () => {
    it('should return orders aggregated by month', async () => {
      const mockQuery = {
        getDateRange: jest
          .fn()
          .mockReturnValue([new Date('2024-01-01'), new Date('2024-12-31')]),
      };
      const pageOptions = {
        page: 1,
        take: 10,
        skip: 0,
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            month: '2024-01',
            ordersCount: '10',
            totalAmount: '1000',
            processedCount: '8',
            returnedCount: '2',
            averageOrderValue: '100',
          },
        ]),
      };

      mockDataSource.manager.createQueryBuilder.mockReturnValueOnce(
        mockQueryBuilder,
      );

      const result = await service.getOrdersByMonth(mockQuery, pageOptions);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].month).toBe('2024-01');
      expect(result.data[0].ordersCount).toBe(10);
      expect(result.data[0].totalAmount).toEqual(new Decimal('1000'));
      expect(result.data[0].processedCount).toBe(8);
    });
  });

  describe('getOrdersByStatus', () => {
    it('should return orders grouped by status with percentages', async () => {
      const mockQuery = {
        getDateRange: jest
          .fn()
          .mockReturnValue([new Date('2024-01-01'), new Date('2024-12-31')]),
      };

      const totalQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '100' }),
      };

      const statusQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { status: OrderStatus.Fulfilled, count: '80', totalRevenue: '8000' },
          { status: OrderStatus.Cancelled, count: '20', totalRevenue: '2000' },
        ]),
      };

      mockDataSource.manager.createQueryBuilder
        .mockReturnValueOnce(totalQueryBuilder)
        .mockReturnValueOnce(statusQueryBuilder);

      const result = await service.getOrdersByStatus(mockQuery);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].status).toBe(OrderStatus.Fulfilled);
      expect(result.data[0].count).toBe(80);
      expect(result.data[0].percentage).toBe(80);
      expect(result.data[1].percentage).toBe(20);
    });
  });

  describe('getProductsAnalytics', () => {
    it('should return paginated products analytics', async () => {
      const mockQuery = {
        getDateRange: jest
          .fn()
          .mockReturnValue([new Date('2024-01-01'), new Date('2024-12-31')]),
      };
      const pageOptions = {
        page: 1,
        take: 10,
        skip: 0,
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            productId: 'prod-123',
            productName: 'Test Product',
            quantitySold: '50',
            totalRevenue: '5000',
            uniqueDropshippersCount: '5',
            averagePrice: '100',
            minPrice: '90',
            maxPrice: '110',
          },
        ]),
      };

      const countQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '1' }),
      };

      mockDataSource.manager.createQueryBuilder
        .mockReturnValueOnce(mockQueryBuilder)
        .mockReturnValueOnce(countQueryBuilder);

      const result = await service.getProductsAnalytics(mockQuery, pageOptions);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].productId).toBe('prod-123');
      expect(result.data[0].quantitySold).toBe(50);
      expect(result.data[0].totalRevenue).toEqual(new Decimal('5000'));
      expect(result.meta.itemCount).toBe(1);
    });
  });

  describe('getProductTimeline', () => {
    it('should return product timeline data', async () => {
      const productId = 'prod-123';
      const mockQuery = {
        getDateRange: jest
          .fn()
          .mockReturnValue([new Date('2024-01-01'), new Date('2024-12-31')]),
      };

      mockDataSource.manager.findOne.mockResolvedValue({
        id: productId,
        baseProduct: { name: 'Test Product' },
        properties: [],
      });

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            date: '2024-01-01',
            price: '100',
            ordersCount: '5',
          },
          {
            date: '2024-01-02',
            price: '105',
            ordersCount: '3',
          },
        ]),
      };

      mockDataSource.manager.createQueryBuilder.mockReturnValueOnce(
        mockQueryBuilder,
      );

      const result = await service.getProductTimeline(productId, mockQuery);

      expect(result.productId).toBe(productId);
      expect(result.productName).toBe('Test Product');
      expect(result.timeline).toHaveLength(2);
      expect(result.timeline[0].date).toBe('2024-01-01');
      expect(result.timeline[0].price).toEqual(new Decimal('100'));
      expect(result.timeline[0].ordersCount).toBe(5);
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 'non-existent';
      const mockQuery = {
        getDateRange: jest
          .fn()
          .mockReturnValue([new Date('2024-01-01'), new Date('2024-12-31')]),
      };

      mockDataSource.manager.findOne.mockResolvedValue(null);

      await expect(
        service.getProductTimeline(productId, mockQuery),
      ).rejects.toThrow('not found');
    });
  });

  describe('getUserDataForAdmins', () => {
    it('should return user analytics for admins', async () => {
      const pageOptionsDto = {
        dateRangeType: 'all',
        page: 1,
        take: 10,
        skip: 0,
        orderBy: 'createdAt',
        order: 'DESC',
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getRawMany: jest.fn().mockResolvedValue([
          {
            id: 'user-123',
            firstName: 'John',
            lastName: 'Doe',
            ordersCount: '5',
            ordersTotalSum: '500',
            netWorth: '1000',
          },
        ]),
      };

      mockDataSource.manager.createQueryBuilder.mockReturnValueOnce(
        mockQueryBuilder,
      );

      const result = await service.getUserDataForAdmins(pageOptionsDto);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('user-123');
      expect(result.meta.itemCount).toBe(1);
    });
  });

  describe('getOrderDataForAdmins', () => {
    it('should return order data for admins', async () => {
      const userId = 'admin-123';
      const pageOptionsDto = {
        range: [new Date('2024-01-01'), new Date('2024-12-31')],
      };

      const mockUser = {
        id: userId,
        role: Role.SuperAdmin,
      };

      mockUsersService.findById.mockResolvedValue(mockUser);
      mockCaslAbilityFactory.createForUser.mockReturnValue({
        can: jest.fn().mockReturnValue(true),
      });

      mockDataSource.manager.find.mockResolvedValueOnce([
        { id: 'order-1', total: '100', createdAt: new Date('2024-01-01') },
      ]);

      mockDataSource.manager.find.mockResolvedValueOnce([
        { id: 'order-2', total: '50', createdAt: new Date('2024-01-02') },
      ]);

      const result = await service.getOrderDataForAdmins(
        userId,
        pageOptionsDto,
      );

      expect(result.completedOrders).toHaveLength(1);
      expect(result.failedOrders).toHaveLength(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent';
      const pageOptionsDto = {
        range: [new Date('2024-01-01'), new Date('2024-12-31')],
      };

      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        service.getOrderDataForAdmins(userId, pageOptionsDto),
      ).rejects.toThrow('NotFoundException');
    });
  });
});
