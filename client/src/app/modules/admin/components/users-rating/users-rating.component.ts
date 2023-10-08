import { Component, Input } from '@angular/core';

import { AdminAnalyticsUserData } from '@shared/interfaces/responses/admin-analytics.respose';

@Component({
  selector: 'app-users-rating',
  templateUrl: './users-rating.component.html',
  styleUrls: ['./users-rating.component.scss'],
})
export class UsersRatingComponent {
  private dataInternal!: AdminAnalyticsUserData[];
  loading = true;
  rows = 10;

  @Input() set data(value: AdminAnalyticsUserData[]) {
    if (!value) {
      return;
    }

    this.dataInternal = value;
    this.loading = false;
  }

  get data() {
    return this.dataInternal;
  }
}
