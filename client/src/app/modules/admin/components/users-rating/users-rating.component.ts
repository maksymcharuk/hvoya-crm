import { LazyLoadMeta } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import {
  BehaviorSubject,
  Subject,
  finalize,
  shareReplay,
  switchMap,
  takeUntil,
} from 'rxjs';

import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';

import { PageOptions } from '@shared/interfaces/page-options.interface';
import { AnalyticsService } from '@shared/services/analytics.service';

@Component({
  selector: 'app-users-rating',
  templateUrl: './users-rating.component.html',
  styleUrls: ['./users-rating.component.scss'],
})
export class UsersRatingComponent implements OnInit, OnDestroy {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild('usersTable') usersTable!: Table;

  private readonly currentYear = new Date().getFullYear();
  private tableMetadata: TableLazyLoadEvent = {};
  private readonly destroyed$ = new Subject<void>();

  private readonly filtersFormValidator = (control: AbstractControl) => {
    const dateRangeType = control.get('dateRangeType')?.value;
    const year = control.get('year')?.value;
    const range = control.get('range')?.value;

    if (dateRangeType === 'year' && !year) {
      control.get('year')?.setErrors({ required: true });
    }

    if (dateRangeType === 'custom' && (!range || !range[0] || !range[1])) {
      control.get('range')?.setErrors({ required: true });
    }

    return null;
  };

  public readonly filtersForm = this.formBuilder.nonNullable.group(
    {
      dateRangeType: ['all'],
      year: [this.currentYear],
      range: [undefined],
    },
    { validators: this.filtersFormValidator },
  );

  public readonly rows = 10;
  public readonly dateRangeTypeOptions = [
    { label: 'Весь час', value: 'all' },
    { label: 'Рік', value: 'year' },
    { label: 'Довільний', value: 'custom' },
  ];
  public readonly yearOptions = Array.from(
    { length: this.currentYear - 2022 + 1 },
    (_, i) => ({
      label: (this.currentYear - i).toString(),
      value: this.currentYear - i,
    }),
  );
  public readonly dateRangeType$ =
    this.filtersForm.controls.dateRangeType.valueChanges;

  loading$ = new BehaviorSubject<boolean>(true);
  options$ = new Subject<PageOptions>();
  userDataPage$ = this.options$.pipe(
    switchMap((options) => {
      this.loading$.next(true);
      return this.analyticsService.getUserDataForAdmins(options).pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loading$.next(false)),
      );
    }),
    shareReplay(1),
  );

  ngOnInit() {
    this.filtersForm.valueChanges.subscribe((value) => {
      const filters: LazyLoadMeta['filters'] = {
        dateRangeType: {
          value: value.dateRangeType,
          matchMode: 'equals',
        },
        year: {
          value: value.year,
          matchMode: 'equals',
        },
        range: {
          value: value.range,
          matchMode: 'equals',
        },
      };
      const pageOptions = new PageOptions({ ...this.tableMetadata, filters });

      if (this.filtersForm.invalid) {
        return;
      }

      this.options$.next(pageOptions);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.tableMetadata = event;
    this.options$.next(new PageOptions(event));
  }

  // private byFulfieldAndActiveOrders(order: Order) {
  //   return ![OrderStatus.Cancelled, OrderStatus.Refunded].includes(
  //     order.currentStatus,
  //   );
  // }

  // private sumOrdersTotal(acc: number, order: Order) {
  //   return (acc += order.total || 0);
  // }
}
