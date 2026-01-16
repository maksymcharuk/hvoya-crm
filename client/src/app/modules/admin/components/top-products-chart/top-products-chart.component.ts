import { startWith } from 'rxjs';

import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AdminAnalyticsService } from '@shared/services/admin-analytics.service';

@Component({
  selector: 'app-top-products-chart',
  templateUrl: './top-products-chart.component.html',
  styleUrls: ['./top-products-chart.component.scss'],
})
export class TopProductsChartComponent {
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

        this.loading = true;
        this.adminAnalyticsService
          .getProductsAnalytics(
            {
              from: value.range[0],
              to: value.range[1],
            },
            {
              take: 10,
              orderBy: 'totalRevenue',
              order: 'DESC',
            },
          )
          .subscribe((response) => {
            this.loading = false;
            // Get top 10 by revenue
            const topProducts = response.data.slice(0, 10);
            this.setup(topProducts);
          });
      });
  }

  private setup(products: any[]) {
    this.data = this.getData(products);
    this.options = this.getOptions();
  }

  private getData(products: any[]) {
    return {
      labels: products.map((p) => p.productName),
      datasets: [
        {
          label: 'Загальний дохід',
          backgroundColor: this.colors.surface500,
          data: products.map((p) => p.totalRevenue),
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
          labels: {
            color: this.colors.textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed.x;
              return this.currencyPipe.transform(
                value,
                undefined,
                undefined,
                '1.0-0',
              );
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: this.colors.textColorSecondary,
            callback: (value: number) => {
              return this.currencyPipe.transform(
                value,
                undefined,
                undefined,
                '1.0-0',
              );
            },
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
