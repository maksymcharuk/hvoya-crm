import { Subject, share, takeUntil } from 'rxjs';

import { Component, OnDestroy } from '@angular/core';

import { AnalyticsService } from '@shared/services/analytics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnDestroy {
  destroyed$ = new Subject<void>();
  analytics$ = this.analyticsService
    .getAnalyticDataForAdmins()
    .pipe(takeUntil(this.destroyed$), share());

  constructor(private readonly analyticsService: AnalyticsService) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
