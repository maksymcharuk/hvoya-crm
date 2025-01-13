import { Subject, takeUntil } from 'rxjs';

import { Component, OnDestroy } from '@angular/core';

import { AnalyticsService } from '@shared/services/analytics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnDestroy {
  destroyed$ = new Subject<void>();
  orderData$ = this.analyticsService
    .getOrderDataForAdmins()
    .pipe(takeUntil(this.destroyed$));

  constructor(private readonly analyticsService: AnalyticsService) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
