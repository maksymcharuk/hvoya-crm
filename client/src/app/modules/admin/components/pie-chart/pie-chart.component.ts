import { DynamicComponent } from '@a2ui/angular';
import { ChartModule } from 'primeng/chart';

import { Component, computed } from '@angular/core';

interface PieChartProperties {
  labelsJson?: { literalString?: string; path?: string } | null;
  dataJson?: { literalString?: string; path?: string } | null;
  titleText?: { literalString?: string; path?: string } | null;
}

@Component({
  standalone: true,
  selector: 'hvoya-pie-chart',
  imports: [ChartModule],
  template: `
    @if (title()) {
      <p class="chart-title">{{ title() }}</p>
    }
    <div style="height: 280px">
      <p-chart type="doughnut" [data]="chartData()" [options]="chartOptions" height="280px" />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .chart-title {
        font-weight: 600;
        margin-bottom: 0.5rem;
        text-align: center;
        font-size: 0.875rem;
      }
    `,
  ],
})
export class PieChartComponent extends DynamicComponent {
  private readonly style = getComputedStyle(document.documentElement);

  private readonly palette = [
    this.style.getPropertyValue('--blue-400').trim() || '#60A5FA',
    this.style.getPropertyValue('--green-400').trim() || '#4ADE80',
    this.style.getPropertyValue('--yellow-400').trim() || '#FACC15',
    this.style.getPropertyValue('--orange-400').trim() || '#FB923C',
    this.style.getPropertyValue('--red-400').trim() || '#F87171',
    this.style.getPropertyValue('--purple-400').trim() || '#C084FC',
    this.style.getPropertyValue('--teal-400').trim() || '#2DD4BF',
    this.style.getPropertyValue('--pink-400').trim() || '#F472B6',
  ];

  readonly chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: this.style.getPropertyValue('--text-color').trim() },
      },
    },
  };

  readonly title = computed<string>(() => {
    const props = this.component().properties as PieChartProperties;
    return this.resolvePrimitive(props.titleText ?? null) ?? '';
  });

  readonly chartData = computed(() => {
    const props = this.component().properties as PieChartProperties;
    try {
      const labels = JSON.parse(
        this.resolvePrimitive(props.labelsJson ?? null) ?? '[]',
      ) as string[];
      const data = JSON.parse(
        this.resolvePrimitive(props.dataJson ?? null) ?? '[]',
      ) as number[];
      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: labels.map((_, i) => this.palette[i % this.palette.length]),
            borderWidth: 1,
          },
        ],
      };
    } catch {
      return { labels: [], datasets: [] };
    }
  });
}
