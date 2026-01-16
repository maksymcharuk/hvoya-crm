# Quick Start Guide - Admin Analytics UI

## For Developers

### 1. Understanding the Architecture

**Service Layer:**

```typescript
// Use this to fetch analytics data
import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

constructor(private analytics: AdminAnalyticsService) {}

// Get dropshippers with filtering
this.analytics.getDropshippersAnalytics(
  { from: new Date('2024-01-01'), to: new Date('2024-12-31') },
  { page: 1, take: 20 }
).subscribe(data => console.log(data));
```

**Component Pattern:**
All analytics components follow this pattern:

```typescript
// 1. Inject service
constructor(private service: AdminAnalyticsService) {}

// 2. Create form for filtering
filtersForm = this.fb.group({ range: [defaultRange] });

// 3. Combine form changes + table metadata
options$ = combineLatest([
  this.filtersForm.valueChanges,
  this.tableMetadata$
]).pipe(...)

// 4. Fetch data based on options
data$ = this.options$.pipe(
  switchMap(opts => this.service.getData(opts))
)

// 5. Use in template with async pipe
<div>{{ data$ | async | json }}</div>
```

### 2. Adding a New Analytics Component

**Step 1: Create Interface**

```typescript
// src/app/shared/interfaces/analystics/my-analytics.interface.ts
export interface MyAnalytics {
  id: string;
  metric1: number;
  metric2: string;
}
```

**Step 2: Add Service Method**

```typescript
// src/app/shared/services/admin-analytics.service.ts
getMyAnalytics(dateRange?: DateRange): Observable<MyAnalytics[]> {
  let params = new HttpParams();
  if (dateRange?.from) {
    params = params.set('from', this.formatDate(dateRange.from));
  }
  return this.http.get<MyAnalytics[]>(
    `${this.baseUrl}/my-analytics`,
    { params }
  );
}
```

**Step 3: Create Component**

```bash
ng generate component modules/admin/components/my-analytics
```

**Step 4: Implement Component**

```typescript
// my-analytics.component.ts
export class MyAnalyticsComponent {
  filtersForm = this.fb.group({
    range: [this.defaultRange],
  });

  data$ = this.filtersForm.valueChanges.pipe(
    switchMap((value) =>
      this.service.getMyAnalytics({
        from: value.range?.[0],
        to: value.range?.[1],
      }),
    ),
    shareReplay(1),
  );
}
```

**Step 5: Add to Module**

```typescript
// admin.module.ts
import { MyAnalyticsComponent } from './components/my-analytics/my-analytics.component';

declarations: [
  // ...existing
  MyAnalyticsComponent,
];
```

**Step 6: Use in Template**

```html
<app-my-analytics />
```

### 3. Modifying an Existing Component

**To add a new column to dropshippers table:**

1. Check if interface has the field

   ```typescript
   // dropshipper-analytics.interface.ts
   // Already has: name, email, totalRevenue, etc.
   ```

2. Add template column

   ```html
   <!-- dropshippers-analytics.component.html -->
   <th pSortableColumn="myNewField">
     <div class="flex justify-content-between">
       My New Field
       <p-sortIcon field="myNewField"></p-sortIcon>
     </div>
   </th>
   ```

3. Add body content
   ```html
   <td>
     <span class="p-column-title">My New Field</span>
     {{ dropshipper.myNewField }}
   </td>
   ```

### 4. Common Patterns

**Currency Formatting:**

```typescript
import { CurrencyPipe } from '@angular/common';

constructor(private currencyPipe: CurrencyPipe) {}

formatCurrency(value: number): string {
  return this.currencyPipe.transform(value, undefined, undefined, '1.0-2') || '₴0.00';
}
```

**Percentage Formatting:**

```typescript
formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
```

**Date Formatting:**

```typescript
formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('uk-UA');
}
```

**Handling Empty States:**

```html
@if (data$ | async as data) { @if (data.length > 0) {
<!-- Show content -->
} @else {
<div>Даних немає</div>
} }
```

**Loading States:**

```html
<p-table [loading]="loading$ | async">
  <ng-template pTemplate="loadingbody">
    <tr *ngFor="let _ of [].constructor(10)">
      <td><p-skeleton height="16px"></p-skeleton></td>
    </tr>
  </ng-template>
</p-table>
```

### 5. Testing a Component

**Basic Test Template:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let service: jasmine.SpyObj<AdminAnalyticsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdminAnalyticsService', ['getData']);

    await TestBed.configureTestingModule({
      declarations: [MyComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AdminAnalyticsService, useValue: spy }],
    }).compileComponents();

    service = TestBed.inject(AdminAnalyticsService);
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 6. Debugging Tips

**Check API Calls:**

```typescript
// In component
this.service.getData().subscribe({
  next: (data) => console.log('Success:', data),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Completed'),
});
```

**Inspect Form Value:**

```typescript
this.filtersForm.valueChanges.subscribe((value) => {
  console.log('Form changed:', value);
});
```

**Check Observable Stream:**

```typescript
data$ = this.options$.pipe(
  tap((opts) => console.log('Options:', opts)),
  switchMap((opts) => this.service.getData(opts)),
  tap((data) => console.log('Data:', data)),
  shareReplay(1),
);
```

---

## For Product Managers / Business Analysts

### What's New

**Three New Analytics Sections:**

1. **Dropshippers Analytics**

   - Table showing all dropshippers
   - 7 key metrics: name, orders, revenue, AOV, returns, wallet, last order
   - Sortable and filterable by date range
   - Default: last 30 days

2. **Orders Analytics**

   - Funnel chart: created → paid → processed → returned
   - Status distribution pie chart
   - All filterable by date range

3. **Products Analytics**
   - Top 10 products by revenue (bar chart)
   - Full products table with sales metrics
   - Sortable and paginated
   - Filterable by date range

### How to Use

**To view dropshippers:**

1. Go to Admin Dashboard
2. Click "Дропшипери" tab
3. See table with metrics
4. Use date picker to filter by custom period

**To view order trends:**

1. Go to Admin Dashboard
2. Click "Замовлення" tab
3. See funnel (top) and status distribution (bottom)
4. Adjust date range as needed

**To analyze products:**

1. Go to Admin Dashboard
2. Click "Продукти" tab
3. See top performers (chart)
4. Scroll to see full products table
5. Sort by revenue, quantity, or return rate

### Date Ranges

**Default:** Last 30 days
**Custom:** Select any date range using calendar picker
**Format:** YYYY-MM-DD (auto-formatted)

### Metrics Explained

**Dropshippers:**

- **Orders Count:** Total orders from this dropshipper
- **Total Revenue:** Sum of all order values
- **Average Order Value (AOV):** Total Revenue / Orders Count
- **Return Rate:** Percentage of orders with returns
- **Wallet Balance:** Current account balance
- **Last Order Date:** When last order was placed

**Orders:**

- **Funnel:** Shows how many orders progress through each stage
- **Status:** Distribution of orders across statuses

**Products:**

- **Quantity Sold:** Total units sold
- **Total Revenue:** Total sales value
- **Unique Dropshippers:** How many different sellers offer this
- **Return Rate:** Percentage returned
- **Average Price:** Mean selling price

---

## For Admins / Support

### Troubleshooting

**"No data shown"**
→ Check date range (try removing filters)
→ Verify you have admin permissions
→ Check browser console for errors

**"Tables loading slowly"**
→ Try narrower date range
→ Check internet connection
→ Clear browser cache (Ctrl+F5)

**"Charts not displaying"**
→ Check browser JavaScript is enabled
→ Try refreshing page
→ Check compatibility (Chrome, Firefox, Safari all work)

**"Columns not visible"**
→ Scroll table horizontally
→ Try zooming out (Ctrl+- or Cmd+-)
→ Tables are responsive and adjust to screen

### Performance Tips

- Use narrower date ranges for faster loading
- Filter before sorting large tables
- Avoid switching between tabs too quickly
- Clear old browser data if page seems slow

---

## File Locations Quick Reference

| Purpose                | Location                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Service                | `client/src/app/shared/services/admin-analytics.service.ts`                           |
| Dropshippers Component | `client/src/app/modules/admin/components/dropshippers-analytics/`                     |
| Orders Charts          | `client/src/app/modules/admin/components/orders-*-chart/`                             |
| Products Components    | `client/src/app/modules/admin/components/products-analytics/` & `top-products-chart/` |
| Interfaces             | `client/src/app/shared/interfaces/analystics/`                                        |
| Dashboard              | `client/src/app/modules/admin/pages/dashboard/`                                       |
| Tests                  | `*.component.spec.ts` next to each component                                          |

---

**For more details, see ANALYTICS_UI_IMPLEMENTATION.md**
