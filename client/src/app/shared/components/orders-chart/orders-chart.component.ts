import { startWith } from 'rxjs';

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { OrderData } from '@shared/interfaces/analystics/order-data.interface';
import { Order } from '@shared/interfaces/entities/order.entity';
import { AnalyticsService } from '@shared/services/analytics.service';

@Component({
  selector: 'app-orders-chart',
  templateUrl: './orders-chart.component.html',
  styleUrls: ['./orders-chart.component.scss'],
})
export class OrdersChartComponent {
  private readonly now = new Date();
  private readonly yearAgo = new Date(
    this.now.getFullYear() - 1,
    this.now.getMonth(),
    1,
  );
  private readonly defaultRange: [Date, Date] = [this.yearAgo, this.now];

  loading = true;
  orderData: OrderData = {
    completedOrders: [],
    failedOrders: [],
  };
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
    red500: this.documentStyle.getPropertyValue('--red-500'),
  };

  filtersForm = this.fb.group({
    range: [this.defaultRange],
  });

  constructor(
    private readonly analysticsService: AnalyticsService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.filtersForm.valueChanges
      .pipe(startWith(this.filtersForm.value))
      .subscribe((value) => {
        this.loading = true;
        this.analysticsService
          .getOrderDataForAdmins({ range: value.range })
          .subscribe((orderData) => {
            this.loading = false;
            this.orderData = orderData;
            this.setup();
          });
      });
  }

  private setup() {
    this.data = this.getData();
    this.options = this.getOptions();
  }

  private getData() {
    if (!this.filtersForm.value.range) {
      return;
    }

    const mostRecentOrderDate = this.filtersForm.value.range[1];
    const mostAncientOrderDate = this.filtersForm.value.range[0];

    const now = this.filtersForm.value.range[1];
    const months =
      (mostRecentOrderDate.getFullYear() - mostAncientOrderDate.getFullYear()) *
        12 +
      mostRecentOrderDate.getMonth() -
      mostAncientOrderDate.getMonth();

    // get last 15 mounth and map it to array of strings
    const labels = Array.from(Array(months).keys())
      .map((i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return date.toLocaleString('uk', { month: 'long' });
      })
      .reverse();

    // get last 15 ${month + year} and map it to array of strings
    const dataKeys = Array.from(Array(15).keys())
      .map((i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.toLocaleString('uk', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
      })
      .reverse();

    // group orders by month and year
    const completedOrdersByMonth = this.orderData.completedOrders.reduce(
      (acc, order) => {
        const date = new Date(order.createdAt);
        const month = date.toLocaleString('uk', { month: 'long' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;

        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(order);

        return acc;
      },
      {} as Record<string, Order[]>,
    );

    // group orders by month and year
    const failedOrdersByMonth = this.orderData.failedOrders.reduce(
      (acc, order) => {
        const date = new Date(order.createdAt);
        const month = date.toLocaleString('uk', { month: 'long' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;

        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(order);

        return acc;
      },
      {} as Record<string, Order[]>,
    );

    // Get orders sum by month map to labels array
    const ongoingOrFulfiledOrdersSumByMonth = dataKeys.map((key) => {
      const orders = completedOrdersByMonth[key];
      if (!orders) {
        return 0;
      }
      return orders.length;
    });

    const refundOrdersSumByMonth = dataKeys.map((key) => {
      const orders = failedOrdersByMonth[key];
      if (!orders) {
        return 0;
      }
      return orders.length;
    });

    return {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Кількість поточних та виконаних замовленнь',
          backgroundColor: this.colors.surface500,
          data: ongoingOrFulfiledOrdersSumByMonth,
        },
        {
          type: 'bar',
          label: 'Кількість повернень та відмов',
          backgroundColor: this.colors.red500,
          data: refundOrdersSumByMonth,
        },
      ],
    };
  }

  private getOptions() {
    return {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: this.colors.textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: this.colors.textColorSecondary,
          },
          grid: {
            color: this.colors.surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
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
