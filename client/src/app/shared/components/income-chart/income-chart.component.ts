import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { OrderStatus } from '@shared/enums/order-status.enum';
import { Order } from '@shared/interfaces/entities/order.entity';

@Component({
  selector: 'app-income-chart',
  templateUrl: './income-chart.component.html',
  styleUrls: ['./income-chart.component.scss'],
})
export class IncomeChartComponent {
  private ordersInternal!: Order[];
  loading = true;

  @Input() set orders(value: Order[]) {
    if (!value) {
      return;
    }

    this.ordersInternal = value;
    this.loading = false;
    this.setup();
  }

  get orders(): Order[] {
    return this.ordersInternal;
  }

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

  constructor(private readonly currencyPipe: CurrencyPipe) {}

  private setup() {
    this.data = this.getData();
    this.options = this.getOptions();
  }

  private getData() {
    const now = new Date();
    // get last 6 mounth and map it to array of strings
    const labels = Array.from(Array(6).keys())
      .map((i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return date.toLocaleString('uk', { month: 'long' });
      })
      .reverse();

    // group orders by month
    const ordersByMonth = this.orders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('uk', { month: 'long' });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month]?.push(order);
      return acc;
    }, {} as { [key: string]: Order[] });

    // Get orders sum by month map to labels array
    const ongoingOrFulfiledOrdersSumByMonth = labels.map((label) => {
      const orders = ordersByMonth[label];
      if (!orders) {
        return 0;
      }
      return orders
        .filter(
          (order) =>
            ![
              OrderStatus.Cancelled,
              OrderStatus.Refunded,
              OrderStatus.Refused,
            ].includes(order.currentStatus.status),
        )
        .reduce((acc, order) => acc + order.total!, 0);
    });

    const refundOrdersSumByMonth = labels.map((label) => {
      const orders = ordersByMonth[label];
      if (!orders) {
        return 0;
      }
      return orders
        .filter((order) =>
          [OrderStatus.Refunded, OrderStatus.Refused].includes(
            order.currentStatus.status,
          ),
        )
        .reduce((acc, order) => acc + order.total!, 0);
    });

    return {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Сума по поточним та виконаним замовленням',
          backgroundColor: this.colors.surface500,
          data: ongoingOrFulfiledOrdersSumByMonth,
        },
        {
          type: 'bar',
          label: 'Сума по поверненням та відмовам',
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
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += this.currencyPipe.transform(
                  context.parsed.y,
                  undefined,
                  undefined,
                  '1.0-0',
                );
              }
              return label;
            },
          },
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
      },
    };
  }
}
