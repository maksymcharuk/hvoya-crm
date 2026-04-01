import { Table, TableLazyLoadEvent } from 'primeng/table';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  finalize,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

@Component({
  standalone: false,
  selector: 'app-products-overview',
  templateUrl: './products-overview.component.html',
  styleUrls: ['./products-overview.component.scss'],
})
export class ProductsOverviewComponent implements OnDestroy {
  private readonly adminAnalyticsService = inject(AdminAnalyticsService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly currencyPipe = inject(CurrencyPipe);

  @ViewChild('productsTable') productsTable!: Table;

  private readonly now = new Date();
  private readonly thirtyDaysAgo = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() - 30,
  );
  private readonly defaultRange: [Date, Date] = [this.thirtyDaysAgo, this.now];

  private readonly tableMetadata$ = new Subject<TableLazyLoadEvent>();
  private readonly destroyed$ = new Subject<void>();

  public readonly filtersForm = this.formBuilder.nonNullable.group({
    range: [this.defaultRange],
  });

  public readonly rows = 10;

  loading$ = new BehaviorSubject<boolean>(true);

  private readonly documentStyle = getComputedStyle(document.documentElement);
  private readonly colors = {
    textColor: this.documentStyle.getPropertyValue('--text-color'),
    textColorSecondary: this.documentStyle.getPropertyValue(
      '--text-color-secondary',
    ),
    surfaceBorder: this.documentStyle.getPropertyValue('--surface-border'),
    orange500: this.documentStyle.getPropertyValue('--orange-500'),
  };

  readonly chartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: this.colors.textColor } },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            this.currencyPipe.transform(
              context.parsed.x,
              undefined,
              undefined,
              '1.0-0',
            ) ?? '',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: this.colors.textColorSecondary,
          callback: (value: number) =>
            this.currencyPipe.transform(value, undefined, undefined, '1.0-0'),
        },
        grid: { color: this.colors.surfaceBorder, drawBorder: false },
      },
      y: {
        ticks: { color: this.colors.textColorSecondary },
        grid: { color: this.colors.surfaceBorder, drawBorder: false },
      },
    },
  };

  topProducts$ = this.filtersForm.valueChanges.pipe(
    startWith(this.filtersForm.value),
    takeUntil(this.destroyed$),
    switchMap((value) =>
      this.adminAnalyticsService.getProductsAnalytics(
        { from: value.range?.[0], to: value.range?.[1] },
        { take: 10, orderBy: 'totalRevenue', order: 'DESC' },
      ),
    ),
    shareReplay(1),
  );

  kpiStats$ = this.topProducts$.pipe(
    map((r) => ({
      totalProducts: r.meta.itemCount,
      topProduct: r.data[0]?.productName ?? '—',
      topRevenue: Number(r.data[0]?.totalRevenue ?? 0),
      totalUnitsSold: r.data.reduce((sum, p) => sum + p.quantitySold, 0),
      avgReturnRate: r.data.length
        ? r.data.reduce((sum, p) => sum + p.returnRate, 0) / r.data.length
        : 0,
    })),
  );

  chartData$ = this.topProducts$.pipe(
    map((r) => ({
      labels: r.data.map((p) => p.productName),
      datasets: [
        {
          label: 'Загальний дохід',
          backgroundColor: this.colors.orange500,
          data: r.data.map((p) => p.totalRevenue),
        },
      ],
    })),
  );

  productsPage$ = combineLatest([
    this.filtersForm.valueChanges.pipe(startWith(this.filtersForm.value)),
    this.tableMetadata$,
  ]).pipe(
    takeUntil(this.destroyed$),
    switchMap(([value, event]) => {
      this.loading$.next(true);
      const opts: any = { ...event };
      if (value.range) {
        opts.from = value.range[0];
        opts.to = value.range[1];
      }
      return this.adminAnalyticsService
        .getProductsAnalytics(
          { from: opts.from, to: opts.to },
          {
            page: opts.first ? opts.first / this.rows + 1 : 1,
            take: opts.rows || this.rows,
            orderBy: opts.sortField || 'totalRevenue',
            order: opts.sortOrder === 1 ? 'ASC' : 'DESC',
          },
        )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => this.loading$.next(false)),
        );
    }),
    shareReplay(1),
  );

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.tableMetadata$.next(event);
  }

  formatCurrency(value: number): string {
    return (
      this.currencyPipe.transform(value, undefined, undefined, '1.0-2') ||
      '₴0.00'
    );
  }

  formatPercent(value: number): string {
    return `${Number(value).toFixed(2)}%`;
  }
}
