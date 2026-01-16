# Analytics Module Documentation

## Overview

This documentation covers the advanced analytics implementation for the HVOYA CRM dropshipping platform. The analytics module provides REST API endpoints for admin dashboards to analyze platform performance across three main domains:

1. **Dropshippers Analytics** - Performance metrics per dropshipper
2. **Orders Analytics** - Order statistics and trends
3. **Products Analytics** - Product sales performance

All analytics endpoints:

- ✅ Require admin role (`AdminAalytics` permission)
- ✅ Support optional date range filtering
- ✅ Use database aggregation (efficient SQL queries)
- ✅ Return paginated results where applicable
- ✅ Support sorting by various metrics

---

## API Endpoints

### Dropshippers Analytics

#### GET `/analytics/admin/dropshippers`

Retrieve aggregated sales metrics for all dropshippers.

**Query Parameters:**

```
from         - Optional start date (YYYY-MM-DD)
to           - Optional end date (YYYY-MM-DD)
page         - Page number (default: 1)
take         - Items per page (default: 10)
orderBy      - Sort field (default: 'createdAt')
order        - Sort order: ASC or DESC (default: DESC)
```

**Response:**

```json
{
  "data": [
    {
      "dropshipperId": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "ordersCount": 150,
      "totalRevenue": 15000.5,
      "averageOrderValue": 100.0,
      "returnedAmount": 500.0,
      "returnRate": 3.33,
      "walletBalance": 2500.0,
      "lastOrderDate": "2024-12-01T10:30:00Z",
      "lifetimeValue": 15000.5
    }
  ],
  "meta": {
    "itemCount": 245,
    "pageCount": 25,
    "page": 1,
    "take": 10,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

**Key Metrics:**

- **ordersCount** - Total number of orders placed (excluding cancelled/refused)
- **totalRevenue** - Sum of all order totals
- **averageOrderValue** - Mean order value (totalRevenue / ordersCount)
- **returnedAmount** - Total amount from order returns
- **returnRate** - Percentage of returned orders (returnedAmount / totalRevenue \* 100)
- **walletBalance** - Current account balance
- **lastOrderDate** - Most recent order timestamp
- **lifetimeValue** - Total lifetime revenue

---

### Orders Analytics

#### GET `/analytics/admin/orders/summary`

Comprehensive order statistics with funnel data.

**Query Parameters:**

```
from    - Optional start date (YYYY-MM-DD)
to      - Optional end date (YYYY-MM-DD)
```

**Response:**

```json
{
  "summary": {
    "totalOrdersCount": 1245,
    "totalRevenue": 124500.0,
    "averageOrderValue": 100.0,
    "averageProcessingTime": 24,
    "completedOrdersCount": 1100,
    "cancelledOrdersCount": 80,
    "refundedOrdersCount": 45,
    "refusedOrdersCount": 20
  },
  "funnel": {
    "created": 1245,
    "paid": 1225,
    "processed": 1100,
    "returned": 65
  }
}
```

**Key Metrics:**

- **averageProcessingTime** - Mean hours from order creation to fulfilled status
- **funnel** - Shows order conversion at each stage

---

#### GET `/analytics/admin/orders/by-month`

Monthly aggregation of order data.

**Query Parameters:**

```
from    - Optional start date (YYYY-MM-DD)
to      - Optional end date (YYYY-MM-DD)
page    - Page number (default: 1)
take    - Items per page (default: 10)
```

**Response:**

```json
{
  "data": [
    {
      "month": "2024-12",
      "ordersCount": 105,
      "totalAmount": 10500.0,
      "processedCount": 95,
      "returnedCount": 5,
      "averageOrderValue": 100.0
    },
    {
      "month": "2024-11",
      "ordersCount": 98,
      "totalAmount": 9800.0,
      "processedCount": 88,
      "returnedCount": 3,
      "averageOrderValue": 100.0
    }
  ]
}
```

---

#### GET `/analytics/admin/orders/by-status`

Orders grouped by status with percentage breakdown.

**Query Parameters:**

```
from    - Optional start date (YYYY-MM-DD)
to      - Optional end date (YYYY-MM-DD)
```

**Response:**

```json
{
  "data": [
    {
      "status": "Fulfilled",
      "count": 1100,
      "percentage": 88.24,
      "totalRevenue": 110000.0
    },
    {
      "status": "Cancelled",
      "count": 80,
      "percentage": 6.42,
      "totalRevenue": 8000.0
    },
    {
      "status": "Refunded",
      "count": 45,
      "percentage": 3.61,
      "totalRevenue": 4500.0
    },
    {
      "status": "Refused",
      "count": 20,
      "percentage": 1.61,
      "totalRevenue": 2000.0
    }
  ]
}
```

---

### Products Analytics

#### GET `/analytics/admin/products`

Retrieve analytics for all products with sales metrics.

**Query Parameters:**

```
from         - Optional start date (YYYY-MM-DD)
to           - Optional end date (YYYY-MM-DD)
page         - Page number (default: 1)
take         - Items per page (default: 10)
orderBy      - Sort field (default: 'createdAt')
order        - Sort order: ASC or DESC (default: DESC)
```

**Response:**

```json
{
  "data": [
    {
      "productId": "uuid",
      "productName": "Premium T-Shirt",
      "quantitySold": 450,
      "totalRevenue": 22500.0,
      "uniqueDropshippersCount": 28,
      "returnRate": 2.5,
      "averagePrice": 50.0,
      "minPrice": 45.0,
      "maxPrice": 55.0
    }
  ],
  "meta": {
    "itemCount": 342,
    "pageCount": 35,
    "page": 1,
    "take": 10,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

**Key Metrics:**

- **quantitySold** - Total units sold
- **totalRevenue** - Total revenue from product sales
- **uniqueDropshippersCount** - Number of distinct dropshippers selling the product
- **returnRate** - Percentage of items returned
- **averagePrice** - Mean selling price
- **minPrice / maxPrice** - Price range

---

#### GET `/analytics/admin/products/:productId/timeline`

Price and order count history for a specific product.

**Query Parameters:**

```
from    - Optional start date (YYYY-MM-DD)
to      - Optional end date (YYYY-MM-DD)
```

**Response:**

```json
{
  "productId": "uuid",
  "productName": "Premium T-Shirt",
  "timeline": [
    {
      "date": "2024-12-01",
      "price": 50.0,
      "ordersCount": 25
    },
    {
      "date": "2024-12-02",
      "price": 51.0,
      "ordersCount": 22
    },
    {
      "date": "2024-12-03",
      "price": 52.0,
      "ordersCount": 28
    }
  ]
}
```

---

## Data Models & DTOs

### Analytics Request DTOs

#### `AnalyticsDateRangeDto`

Base DTO for date range filtering:

```typescript
export class AnalyticsDateRangeDto {
  from?: Date; // Optional start date
  to?: Date; // Optional end date
  getDateRange(): [Date, Date]; // Helper method
}
```

#### `AnalyticsPageOptionsDto`

Pagination and sorting:

```typescript
export class AnalyticsPageOptionsDto {
  page?: number; // Default: 1
  take?: number; // Default: 10
  orderBy?: string; // Default: 'createdAt'
  order?: SortOrder; // Default: DESC
}
```

### Response DTOs

#### Dropshippers

- `DroppershipsAnalyticsQueryDto` - Request DTO
- `DropshipperAnalyticsDto` - Individual dropshipper response
- `DroppershipsAnalyticsPageDto` - Paginated response

#### Orders

- `OrdersAnalyticsQueryDto` - Request DTO
- `OrdersSummaryDto` - Summary statistics
- `OrdersFunnelDto` - Conversion funnel
- `OrdersByMonthDto` - Monthly aggregation
- `OrdersByStatusDto` - Status breakdown

#### Products

- `ProductsAnalyticsQueryDto` - Request DTO
- `ProductAnalyticsDto` - Individual product response
- `ProductTimelinePointDto` - Timeline data point
- `ProductTimelineResponseDto` - Timeline response

---

## Service Methods

### AnalyticsService

All methods use optimized SQL queries via TypeORM QueryBuilder for efficient database aggregation.

#### Dropshippers Analytics

```typescript
async getDropshippersAnalytics(
  query: DroppershipsAnalyticsQueryDto,
  pageOptions: AnalyticsPageOptionsDto
): Promise<DroppershipsAnalyticsPageDto>
```

#### Orders Analytics

```typescript
// Summary with funnel
async getOrdersSummary(query: any): Promise<OrdersSummaryResponseDto>

// Monthly aggregation
async getOrdersByMonth(
  query: any,
  pageOptions: AnalyticsPageOptionsDto
): Promise<OrdersByMonthResponseDto>

// Status breakdown
async getOrdersByStatus(query: any): Promise<OrdersByStatusResponseDto>
```

#### Products Analytics

```typescript
// All products with metrics
async getProductsAnalytics(
  query: any,
  pageOptions: AnalyticsPageOptionsDto
): Promise<ProductsAnalyticsPageDto>

// Product timeline
async getProductTimeline(
  productId: string,
  query: any
): Promise<ProductTimelineResponseDto>
```

---

## Security & Permissions

All analytics endpoints are protected by:

1. **JWT Authentication** - `JwtAuthGuard`
2. **Role-Based Access Control** - `PoliciesGuard`
3. **CASL Permission Checks** - Requires `Action.Read` on `AdminAalytics`

```typescript
@CheckPolicies((ability: AppAbility) =>
  ability.can(Action.Read, 'AdminAalytics')
)
```

Only users with admin role can access analytics endpoints.

---

## Database Optimization

### Query Optimization Techniques

1. **Aggregation in SQL** - All calculations performed at database level
2. **Efficient Joins** - LEFT OUTER JOINs to include zero-count results
3. **Index Usage** - Queries leverage existing indexes on:

   - `order.createdAt`
   - `order.currentStatus`
   - `order.customer`
   - `user.role`
   - `balance.owner`

4. **Decimal Precision** - Using `Decimal.js` for financial calculations
5. **Pagination** - Offset/limit patterns for large result sets

### Example Query Pattern

```sql
SELECT
  user.id,
  COUNT(DISTINCT order.id) as ordersCount,
  SUM(order.total) as totalRevenue,
  AVG(order.total) as averageOrderValue
FROM user
LEFT JOIN order ON user.id = order.customer
WHERE user.role = 'User'
  AND order.currentStatus NOT IN ('Cancelled', 'Refused')
  AND order.createdAt BETWEEN ? AND ?
GROUP BY user.id
ORDER BY totalRevenue DESC
LIMIT ? OFFSET ?
```

---

## Date Range Handling

Date ranges are optional. When not provided:

- **Start Date (from)** - Defaults to Unix epoch (all-time)
- **End Date (to)** - Defaults to current date/time

**Examples:**

Get all-time metrics:

```
GET /analytics/admin/dropshippers
```

Get metrics for specific period:

```
GET /analytics/admin/dropshippers?from=2024-01-01&to=2024-12-31
```

---

## Testing

Comprehensive unit tests are included:

### Test Coverage

**Service Tests:**

- ✅ Dropshippers analytics pagination
- ✅ Orders summary with funnel
- ✅ Orders by month aggregation
- ✅ Orders by status breakdown
- ✅ Products analytics pagination
- ✅ Product timeline data
- ✅ Error handling (NotFound, etc.)
- ✅ Edge cases (zero results, null values)

**Controller Tests:**

- ✅ All endpoint handlers
- ✅ Service method invocation
- ✅ Parameter passing
- ✅ Response transformation

Run tests:

```bash
npm test
npm run test:cov  # With coverage report
```

---

## Performance Characteristics

### Query Performance

| Operation                  | Complexity | Time (est.) |
| -------------------------- | ---------- | ----------- |
| Dropshippers Summary       | O(n log n) | < 500ms     |
| Orders Monthly (12 months) | O(n)       | < 200ms     |
| Products (1000 products)   | O(n log n) | < 800ms     |
| Product Timeline (1 year)  | O(n)       | < 100ms     |

### Caching

The controller uses `@UseInterceptors(CacheInterceptor)` for built-in caching:

- **Default TTL** - Configure via `@nestjs/cache-manager`
- **Cache Keys** - Automatically generated from endpoint + params

---

## Example Usage

### cURL

```bash
# Dropshippers analytics for current year
curl -X GET "http://localhost:3000/analytics/admin/dropshippers?from=2024-01-01&to=2024-12-31&page=1&take=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Orders summary
curl -X GET "http://localhost:3000/analytics/admin/orders/summary?from=2024-01-01&to=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Product timeline
curl -X GET "http://localhost:3000/analytics/admin/products/PRODUCT_ID/timeline?from=2024-01-01&to=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript/TypeScript

```typescript
// Fetch dropshippers analytics
const response = await fetch('/analytics/admin/dropshippers?page=1&take=10', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
console.log(data.data); // Array of DropshipperAnalyticsDto
console.log(data.meta); // Pagination metadata
```

---

## Migration & Backward Compatibility

### Legacy Endpoints (Preserved)

The following endpoints remain unchanged for backward compatibility:

- `GET /analytics/admins/users` - User analytics (legacy)
- `GET /analytics/admins/orders` - Order data (legacy)

New dashboard implementations should use the new `/analytics/admin/*` endpoints.

---

## Future Enhancements

Potential improvements for future releases:

1. **Custom Date Ranges** - Relative dates (e.g., "last 30 days")
2. **Comparative Analytics** - Year-over-year, month-over-month comparisons
3. **Forecasting** - Trend prediction using historical data
4. **Webhooks** - Real-time alerts for analytics thresholds
5. **Export** - CSV/PDF export of reports
6. **Custom Reports** - Admin-defined report builders
7. **Real-time Dashboards** - WebSocket live updates
8. **Advanced Filtering** - Category, status, amount ranges

---

## Troubleshooting

### Common Issues

**"AdminAalytics permission denied"**

- Ensure user has admin role
- Check CASL ability factory configuration

**"Empty results for date range"**

- Verify date format (YYYY-MM-DD)
- Check that data exists in the specified period

**"Slow query performance"**

- Check database indexes on `order.createdAt`, `user.role`
- Consider reducing date range
- Check database statistics

**"Decimal precision errors"**

- Ensure Decimal.js is properly configured
- All financial fields use DecimalTransformer

---

## Files Modified/Created

```
src/
├── dtos/analytics/
│   ├── analytics-date-range.dto.ts (NEW)
│   ├── analytics-page-options.dto.ts (NEW)
│   ├── dropshippers-analytics.dto.ts (NEW)
│   ├── orders-analytics.dto.ts (NEW)
│   └── products-analytics.dto.ts (NEW)
├── modules/analytics/
│   ├── analytics.controller.ts (MODIFIED)
│   ├── analytics.controller.spec.ts (MODIFIED)
│   ├── analytics.module.ts (MODIFIED)
│   └── services/
│       ├── analytics.service.ts (MODIFIED)
│       └── analytics.service.spec.ts (MODIFIED)
```

---

## Support & Questions

For issues or questions about the analytics implementation, refer to:

- Service implementation: [analytics.service.ts](./services/analytics.service.ts)
- Controller endpoints: [analytics.controller.ts](./analytics.controller.ts)
- DTOs & types: [src/dtos/analytics/](../../../dtos/analytics/)
- Tests: `*.spec.ts` files in this module
