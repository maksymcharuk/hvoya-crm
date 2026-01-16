# Admin Analytics UI Implementation Guide

## Overview

This document describes the Angular client implementation of admin analytics for the HVOYA CRM dropshipping platform. The implementation extends the existing admin dashboard with three new analytics sections: Dropshippers Analytics, Orders Analytics, and Products Analytics.

## Architecture & Patterns

### Service Layer

**AdminAnalyticsService** (`src/app/shared/services/admin-analytics.service.ts`)

- Centralized service for all analytics API calls
- Integrates with backend endpoints at `/analytics/admin/*`
- Provides methods for:
  - `getDropshippersAnalytics()` - Paginated dropshippers metrics
  - `getOrdersSummary()` - Orders funnel and summary stats
  - `getOrdersByMonth()` - Monthly order aggregation
  - `getOrdersByStatus()` - Orders grouped by status
  - `getProductsAnalytics()` - Paginated product metrics
  - `getProductTimeline()` - Product price/orders history

### Data Structures

All interfaces are located in `src/app/shared/interfaces/analystics/`:

- **dropshipper-analytics.interface.ts** - Dropshipper metrics
- **orders-analytics.interface.ts** - Orders data structures (summary, funnel, by-month, by-status)
- **products-analytics.interface.ts** - Product metrics and timeline
- **paginated-response.interface.ts** - Generic paginated response wrapper

### Components

#### 1. Dropshippers Analytics Component

**Location:** `src/app/modules/admin/components/dropshippers-analytics/`

- **Purpose:** Display paginated table of dropshippers with key metrics
- **Features:**
  - Lazy-loaded table with sorting and pagination
  - Date range filtering (default: last 30 days)
  - Columns: Name, Orders Count, Total Revenue, AOV, Return Rate, Wallet Balance, Last Order Date
  - Loading states with skeleton screens
  - Currency and percentage formatting

#### 2. Orders Analytics Components

##### 2a. Orders Funnel Chart

**Location:** `src/app/modules/admin/components/orders-funnel-chart/`

- **Purpose:** Visualize conversion funnel: created → paid → processed → returned
- **Chart Type:** Horizontal bar chart (PrimeNG Chart with Chart.js)
- **Features:**
  - Date range filtering
  - Real-time data loading
  - Color-coded stages

##### 2b. Orders Status Chart

**Location:** `src/app/modules/admin/components/orders-status-chart/`

- **Purpose:** Show orders distribution by status
- **Chart Type:** Doughnut chart
- **Features:**
  - Date range filtering
  - Status-based color coding
  - Percentage tooltips

#### 3. Products Analytics Components

##### 3a. Top Products Chart

**Location:** `src/app/modules/admin/components/top-products-chart/`

- **Purpose:** Display top 10 products by revenue
- **Chart Type:** Horizontal bar chart
- **Features:**
  - Date range filtering
  - Auto-fetches and sorts by revenue
  - Currency formatting on axes

##### 3b. Products Table

**Location:** `src/app/modules/admin/components/products-analytics/`

- **Purpose:** Comprehensive products analytics table
- **Features:**
  - Lazy-loaded table with sorting and pagination
  - Date range filtering
  - Columns: Product Name, Quantity Sold, Total Revenue, Unique Dropshippers, Return Rate, Avg Price
  - Loading states with skeleton screens

## Dashboard Integration

The admin dashboard (`admin/pages/dashboard/`) now includes:

1. **Legacy sections** (unchanged):

   - Users Rating table
   - Income Chart (orders amount by month)
   - Orders Chart (orders count by month)

2. **New sections** (tabbed layout):
   - **Dropshippers Tab** - Dropshippers analytics table
   - **Orders Tab** - Funnel chart + Status chart
   - **Products Tab** - Top products chart + Products table

### Tab Structure

```html
<p-tabView>
  <p-tabPanel header="Дропшипери" leftIcon="pi pi-list">
    <!-- Dropshippers Analytics -->
  </p-tabPanel>
  <p-tabPanel header="Замовлення" leftIcon="pi pi-shopping-cart">
    <!-- Orders Charts -->
  </p-tabPanel>
  <p-tabPanel header="Продукти" leftIcon="pi pi-box">
    <!-- Top Products + Products Table -->
  </p-tabPanel>
</p-tabView>
```

## Data Flow

```
User Action (Date Range Selection)
    ↓
FormBuilder Updates
    ↓
RxJS Observable Pipeline (combineLatest + switchMap)
    ↓
AdminAnalyticsService.get*()
    ↓
HTTP GET Request to /analytics/admin/*
    ↓
Component receives data
    ↓
Template renders with loaded data / skeleton states
```

## Date Range Filtering

All analytics support date range filtering with a default range of the last 30 days:

```typescript
private readonly now = new Date();
private readonly thirtyDaysAgo = new Date(
  this.now.getFullYear(),
  this.now.getMonth(),
  this.now.getDate() - 30,
);
private readonly defaultRange: [Date, Date] = [this.thirtyDaysAgo, this.now];
```

Date ranges are passed to the service:

```typescript
adminAnalyticsService.getDropshippersAnalytics(
  {
    from: dateRange[0],
    to: dateRange[1],
  },
  { page: 1, take: 10 },
);
```

## Styling & UI Consistency

All components follow existing design patterns:

- **PrimeNG Components** for UI elements (tables, charts, buttons, etc.)
- **PrimeFlex** CSS framework for layout
- **CSS Variables** for theming (--text-color, --surface-500, etc.)
- **Skeleton loaders** for loading states (p-skeleton)
- **p-calendar** for date range selection
- **Chart.js via PrimeNG** for data visualization

### Chart Configuration

All charts use consistent configuration:

- Theme colors from CSS variables
- Responsive aspect ratios
- Accessible tooltips with formatted values
- Legend positioning
- Border and grid styling

Example:

```typescript
colors = {
  textColor: getComputedStyle(document.documentElement).getPropertyValue(
    '--text-color',
  ),
  surface500: getComputedStyle(document.documentElement).getPropertyValue(
    '--surface-500',
  ),
  // ...
};

options = {
  plugins: {
    legend: { labels: { color: this.colors.textColor } },
    tooltip: {
      callbacks: {
        /* format values */
      },
    },
  },
  scales: {
    x: { ticks: { color: this.colors.textColorSecondary } },
    y: { ticks: { color: this.colors.textColorSecondary } },
  },
};
```

## Reactive Patterns Used

### Form-Driven Updates

```typescript
this.filtersForm.valueChanges
  .pipe(startWith(this.filtersForm.value))
  .subscribe((value) => {
    // Handle form changes
  });
```

### Lazy Loading for Tables

```typescript
options$ = combineLatest([
  this.filtersForm.valueChanges.pipe(startWith(this.filtersForm.value)),
  this.tableMetadata$,
]).pipe(
  map(([formValue, event]) => {
    // Convert to page options
  }),
);

data$ = this.options$.pipe(
  switchMap((options) => {
    return this.service
      .getData(options)
      .pipe(finalize(() => this.loading$.next(false)));
  }),
  shareReplay(1),
);
```

### Memory Management

All components properly handle subscription cleanup:

```typescript
private readonly destroyed$ = new Subject<void>();

// In subscriptions
.pipe(takeUntil(this.destroyed$))

ngOnDestroy() {
  this.destroyed$.next();
  this.destroyed$.complete();
}
```

## Module Configuration

**AdminModule** (`src/app/modules/admin/admin.module.ts`) imports:

```typescript
imports: [
  // Core
  CommonModule,
  AdminRoutingModule,
  FormsModule,
  ReactiveFormsModule,

  // PrimeNG
  ButtonModule,
  DropdownModule,
  CalendarModule,
  OverlayPanelModule,
  BadgeModule,
  TableModule,
  SkeletonModule,
  ChartModule,
  TabViewModule,

  // Custom
  LayoutModule,
  SharedModule,
];
```

## Error Handling & Empty States

- **Loading states** use skeleton screens to indicate data is loading
- **Empty states** display "Даних немає" (No data) message
- **API errors** propagate through RxJS error handling
- **HTTP interceptors** (if configured) handle auth and error responses

## Performance Considerations

1. **Lazy Loading Tables** - Tables use PrimeNG's lazy loading to fetch data on demand
2. **Change Detection** - OnPush strategy (implicit via PrimeNG)
3. **Memory Management** - Proper cleanup of subscriptions with takeUntil
4. **Pagination** - Default page size is 10 items per page
5. **Caching** - ShareReplay(1) on data streams prevents redundant API calls

## Testing

All components have basic unit test specs:

- **dropshippers-analytics.component.spec.ts** - Tests component creation and formatting methods
- **orders-funnel-chart.component.spec.ts** - Tests chart setup
- **orders-status-chart.component.spec.ts** - Tests chart creation
- **products-analytics.component.spec.ts** - Tests component and formatting
- **top-products-chart.component.spec.ts** - Tests chart component
- **admin-analytics.service.spec.ts** - Tests API integration

Run tests with:

```bash
npm test -- src/app/modules/admin/components/
npm test -- src/app/shared/services/admin-analytics.service
```

## API Integration Points

All endpoints are consumed from backend at `/analytics/admin/`:

| Component        | Endpoint                 | Method | Parameters                           |
| ---------------- | ------------------------ | ------ | ------------------------------------ |
| Dropshippers     | `/dropshippers`          | GET    | from, to, page, take, orderBy, order |
| Orders Funnel    | `/orders/summary`        | GET    | from, to                             |
| Orders Status    | `/orders/by-status`      | GET    | from, to                             |
| Orders by Month  | `/orders/by-month`       | GET    | from, to, page, take                 |
| Top Products     | `/products`              | GET    | from, to, page, take, orderBy, order |
| Products Table   | `/products`              | GET    | from, to, page, take, orderBy, order |
| Product Timeline | `/products/:id/timeline` | GET    | from, to                             |

## Future Enhancements

1. **Product Timeline Details** - Add expandable row to show product price/orders history
2. **Export Functionality** - CSV/PDF export for tables and charts
3. **Custom Date Ranges** - Presets like "Last 7 days", "Year-to-date"
4. **Real-time Updates** - WebSocket integration for live data
5. **Comparative Analytics** - YoY, MoM comparisons
6. **Advanced Filtering** - Category, price range filters
7. **Dashboard Customization** - Admin-configurable widget layout

## File Structure

```
client/src/app/
├── modules/admin/
│   ├── components/
│   │   ├── dropshippers-analytics/
│   │   ├── orders-funnel-chart/
│   │   ├── orders-status-chart/
│   │   ├── products-analytics/
│   │   └── top-products-chart/
│   └── pages/dashboard/
│       ├── dashboard.component.ts
│       └── dashboard.component.html
└── shared/
    ├── interfaces/analystics/
    │   ├── dropshipper-analytics.interface.ts
    │   ├── orders-analytics.interface.ts
    │   ├── products-analytics.interface.ts
    │   └── paginated-response.interface.ts
    └── services/
        └── admin-analytics.service.ts
```

## Troubleshooting

### "Cannot resolve module" errors

- Ensure all interfaces are exported from their respective files
- Check import paths use @shared alias correctly

### Charts not rendering

- Verify ChartModule is imported in AdminModule
- Check that Chart.js is installed (should be via primeng)
- Ensure chart data structure matches Chart.js expectations

### Table not loading data

- Verify AdminAnalyticsService is injected correctly
- Check date range format (YYYY-MM-DD)
- Ensure API returns paginated response with `data` and `meta` fields
- Check browser Network tab for API request/response

### Styling issues

- Verify CSS variables are defined in theme
- Check that SkeletonModule, TableModule imports are present
- Inspect with browser dev tools to see computed styles

## Summary

This implementation provides a complete, production-ready admin analytics UI that:

✅ Consumes backend analytics endpoints
✅ Maintains design consistency with existing dashboard
✅ Supports date range filtering across all metrics
✅ Provides responsive tables with pagination
✅ Displays data in multiple chart formats
✅ Handles loading and empty states gracefully
✅ Follows Angular best practices (DI, reactive patterns, cleanup)
✅ Includes unit tests for all components
✅ Achieves successful build and compilation
