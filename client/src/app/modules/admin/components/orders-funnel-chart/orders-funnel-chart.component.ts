import { startWith } from 'rxjs';

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

@Component({
  selector: 'app-orders-funnel-chart',
  templateUrl: './orders-funnel-chart.component.html',
  styleUrls: ['./orders-funnel-chart.component.scss'],
})
export class OrdersFunnelChartComponent {
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
          .getOrdersSummary({
            from: value.range[0],
            to: value.range[1],
          })
          .subscribe((response) => {
            this.loading = false;
            this.setup(response.funnel);
          });
      });
  }

  private setup(funnel: any) {
    this.data = this.getData(funnel);
    this.options = this.getOptions();
  }

  private getData(funnel: any) {
    const stages = [
      { label: 'Створено', value: funnel.created, color: this.colors.blue500 },
      { label: 'Оплачено', value: funnel.paid, color: this.colors.green500 },
      {
        label: 'Оброблено',
        value: funnel.processed,
        color: this.colors.yellow500,
      },
      { label: 'Повернено', value: funnel.returned, color: this.colors.red500 },
    ];

    return {
      labels: stages.map((s) => s.label),
      datasets: [
        {
          label: 'Кількість замовлень',
          data: stages.map((s) => s.value),
          backgroundColor: stages.map((s) => s.color),
          borderColor: stages.map((s) => s.color),
        },
      ],
    };
  }

  private getOptions() {
    return {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.parsed.x} замовлень`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: this.colors.textColorSecondary,
          },
          grid: {
            color: this.colors.surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: this.colors.textColorSecondary,
          },
          grid: {
            color: this.colors.surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
