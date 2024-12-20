import { Component, Input } from '@angular/core';

import { OrderStatus } from '@shared/enums/order-status.enum';
import { Order } from '@shared/interfaces/entities/order.entity';

@Component({
  selector: 'app-orders-chart',
  templateUrl: './orders-chart.component.html',
  styleUrls: ['./orders-chart.component.scss'],
})
export class OrdersChartComponent {
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

  private setup() {
    this.data = this.getData();
    this.options = this.getOptions();
  }

  private getData() {
    const now = new Date();
    // get last 15 mounth and map it to array of strings
    const labels = Array.from(Array(15).keys())
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

    // group orders by month
    const ordersByMonth = this.orders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('uk', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);

      return acc;
    }, {} as { [key: string]: Order[] });

    // get orders count by month map to labels array
    const ongoingOrFulfiledOrdersCountByMonth = dataKeys.map((key) => {
      const orders = ordersByMonth[key];
      if (!orders) {
        return 0;
      }
      return orders.filter(
        (order) =>
          ![OrderStatus.Cancelled, OrderStatus.Refunded].includes(
            order.currentStatus,
          ),
      ).length;
    });

    const canceledOrRefundOrdersCountByMonth = dataKeys.map((key) => {
      const orders = ordersByMonth[key];
      if (!orders) {
        return 0;
      }
      return orders.filter((order) =>
        [OrderStatus.Cancelled, OrderStatus.Refunded].includes(
          order.currentStatus,
        ),
      ).length;
    });

    return {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Поточні та виконані замовлення',
          backgroundColor: this.colors.surface500,
          data: ongoingOrFulfiledOrdersCountByMonth,
        },
        {
          type: 'bar',
          label: 'Скасовані та повернуті замовлення',
          backgroundColor: this.colors.red500,
          data: canceledOrRefundOrdersCountByMonth,
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
