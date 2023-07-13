import { share } from 'rxjs';

import { Component } from '@angular/core';

import { AnalyticsService } from '@shared/services/analytics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent {
  analytics$ = this.analyticsService.getAnalyticDataForAdmins().pipe(share());

  constructor(private readonly analyticsService: AnalyticsService) {}
}
