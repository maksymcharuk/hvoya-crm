import { startWith } from 'rxjs';

import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';
import { OrdersFunnel, OrdersSummary } from '@shared/interfaces/analystics/orders-analytics.interface';

@Component({
  selector: 'app-orders-overview',
  templateUrl: './orders-overview.component.html',
  styleUrls: ['./orders-overview.component.scss'],
})
export class OrdersOverviewComponent implements OnInit {
  private readonly now = new Date();
  private readonly thirtyDaysAgo = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() - 30,
  );
  private readonly defaultRange: [Date, Date] = [this.thirtyDaysAgo, this.now];

  loadingSummary = true;
  loadingTrend = true;
  summary: OrdersSummary | null = null;
  funnel: OrdersFunnel | null = null;
  trendData: any = null;
  trendOptions: any = null;

  documentStyle = getComputedStyle(document.documentElement);
  colors = {
    textColor: this.documentStyle.getPropertyValue('--text-color'),
    textColorSecondary: this.documentStyle.getPropertyValue('--text-color-secondary'),
    surfaceBorder: this.documentStyle.getPropertyValue('--surface-border'),
    blue500: this.documentStyle.getPropertyValue('--blue-500'),
    green500: this.documentStyle.getPropertyValue('--green-500'),
  };

  filtersForm = this.fb.group({
    range: [this.defaultRange],
  });

  constructor(
    private readonly adminAnalyticsService: AdminAnalyticsService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.filtersForm.valueChanges
      .pipe(startWith(this.filtersForm.value))
      .subscribe((value) => {
        if (!value.range) return;
        const dateRange = { from: value.range[0], to: value.range[1] };

        this.loadingSummary = true;
        this.loadingTrend = true;

        this.adminAnalyticsService.getOrdersSummary(dateRange).subscribe((response) => {
          this.loadingSummary = false;
          this.summary = response.summary;
          this.funnel = response.funnel;
        });

        this.adminAnalyticsService.getOrdersByMonth(dateRange).subscribe((response) => {
          this.loadingTrend = false;
          this.setupTrendChart(response.data);
        });
      });
  }

  get fulfillmentRate(): number {
    if (!this.summary?.totalOrdersCount) return 0;
    return (this.summary.completedOrdersCount / this.summary.totalOrdersCount) * 100;
  }

  get returnRate(): number {
    if (!this.funnel?.created) return 0;
    return (this.funnel.returned / this.funnel.created) * 100;
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, undefined, undefined, '1.0-0') || '₴0';
  }

  formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  private setupTrendChart(data: any[]) {
    this.trendData = {
      labels: data.map((d) => d.month),
      datasets: [
        {
          label: 'Замовлення',
          data: data.map((d) => d.ordersCount),
          borderColor: this.colors.blue500,
          backgroundColor: this.colors.blue500 + '33',
          fill: false,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Дохід (₴)',
          data: data.map((d) => d.revenueAmount),
          borderColor: this.colors.green500,
          backgroundColor: this.colors.green500 + '33',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };

    this.trendOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: this.colors.textColor },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed.y;
              if (context.dataset.yAxisID === 'y1') {
                return this.formatCurrency(value);
              }
              return `${value} замовлень`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: this.colors.textColorSecondary },
          grid: { color: this.colors.surfaceBorder },
        },
        y: {
          type: 'linear',
          position: 'left',
          ticks: { color: this.colors.textColorSecondary },
          grid: { color: this.colors.surfaceBorder },
          title: { display: true, text: 'Замовлення', color: this.colors.textColorSecondary },
        },
        y1: {
          type: 'linear',
          position: 'right',
          ticks: {
            color: this.colors.textColorSecondary,
            callback: (value: number) => this.formatCurrency(value),
          },
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Дохід (₴)', color: this.colors.textColorSecondary },
        },
      },
    };
  }
}
