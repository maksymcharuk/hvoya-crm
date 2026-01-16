import { startWith } from 'rxjs';

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

@Component({
  selector: 'app-orders-status-chart',
  templateUrl: './orders-status-chart.component.html',
  styleUrls: ['./orders-status-chart.component.scss'],
})
export class OrdersStatusChartComponent {
  private readonly now = new Date();
  private readonly thirtyDaysAgo = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() - 30,
  );
  private readonly defaultRange: [Date, Date] = [this.thirtyDaysAgo, this.now];

  loading = true;
  data: any;
  options: any;
  documentStyle = getComputedStyle(document.documentElement);

  colors = {
    textColor: this.documentStyle.getPropertyValue('--text-color'),
    textColorSecondary: this.documentStyle.getPropertyValue(
      '--text-color-secondary',
    ),
    surfaceBorder: this.documentStyle.getPropertyValue('--surface-border'),
    surface500: this.documentStyle.getPropertyValue('--surface-500'),
    blue500: this.documentStyle.getPropertyValue('--blue-500'),
    green500: this.documentStyle.getPropertyValue('--green-500'),
    yellow500: this.documentStyle.getPropertyValue('--yellow-500'),
    orange500: this.documentStyle.getPropertyValue('--orange-500'),
    red500: this.documentStyle.getPropertyValue('--red-500'),
  };

  filtersForm = this.fb.group({
    range: [this.defaultRange],
  });

  constructor(
    private readonly adminAnalyticsService: AdminAnalyticsService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.filtersForm.valueChanges
      .pipe(startWith(this.filtersForm.value))
      .subscribe((value) => {
        if (!value.range) return;

        this.loading = true;
        this.adminAnalyticsService
          .getOrdersByStatus({
            from: value.range[0],
            to: value.range[1],
          })
          .subscribe((statuses) => {
            this.loading = false;
            this.setup(statuses);
          });
      });
  }

  private setup(statuses: any) {
    this.data = this.getData(statuses.data);
    this.options = this.getOptions();
  }

  private getData(statuses: any[]) {
    const colors = [
      this.colors.blue500,
      this.colors.green500,
      this.colors.yellow500,
      this.colors.orange500,
      this.colors.red500,
    ];

    return {
      labels: statuses.map((s) => s.status),
      datasets: [
        {
          data: statuses.map((s) => s.count),
          backgroundColor: colors.slice(0, statuses.length),
          borderColor: colors.slice(0, statuses.length),
        },
      ],
    };
  }

  private getOptions() {
    return {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: this.colors.textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const statuses = context.chart.data.labels;
              const status = statuses[context.dataIndex];
              const count = context.parsed;
              return `${status}: ${count} замовлень`;
            },
          },
        },
      },
    };
  }
}
