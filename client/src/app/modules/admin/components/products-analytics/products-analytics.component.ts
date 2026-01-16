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
  selector: 'app-products-analytics',
  templateUrl: './products-analytics.component.html',
  styleUrls: ['./products-analytics.component.scss'],
})
export class ProductsAnalyticsComponent implements OnDestroy {
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

  private tableMetadata$ = new Subject<TableLazyLoadEvent>();
  private readonly destroyed$ = new Subject<void>();

  public readonly filtersForm = this.formBuilder.nonNullable.group({
    range: [this.defaultRange],
  });

  public readonly rows = 10;

  loading$ = new BehaviorSubject<boolean>(true);

  options$ = combineLatest([
    this.filtersForm.valueChanges.pipe(startWith(this.filtersForm.value)),
    this.tableMetadata$,
  ]).pipe(
    takeUntil(this.destroyed$),
    map(([value, event]) => {
      const pageOptions: any = {
        ...event,
      };

      if (value.range) {
        pageOptions.from = value.range[0];
        pageOptions.to = value.range[1];
      }

      return pageOptions;
    }),
  );

  productsPage$ = this.options$.pipe(
    switchMap((options) => {
      this.loading$.next(true);
      return this.adminAnalyticsService
        .getProductsAnalytics(
          {
            from: options.from,
            to: options.to,
          },
          {
            page: options.first ? options.first / this.rows + 1 : 1,
            take: options.rows || this.rows,
            orderBy: options.sortField || 'totalRevenue',
            order: options.sortOrder === 1 ? 'ASC' : 'DESC',
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
    return `${value.toFixed(2)}%`;
  }
}
