import { DynamicComponent } from '@a2ui/angular';
import { ChartModule } from 'primeng/chart';

import { Component, computed } from '@angular/core';

interface LineChartProperties {
  labelsJson?: { literalString?: string; path?: string } | null;
  datasetsJson?: { literalString?: string; path?: string } | null;
  titleText?: { literalString?: string; path?: string } | null;
}

@Component({
  standalone: true,
  selector: 'hvoya-line-chart',
  imports: [ChartModule],
  template: `
    @if (title()) {
      <p class="chart-title">{{ title() }}</p>
    }
    <div style="height: 280px">
      <p-chart type="line" [data]="chartData()" [options]="chartOptions" height="280px" />
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
export class LineChartComponent extends DynamicComponent {
  private readonly style = getComputedStyle(document.documentElement);

  private readonly palette = [
    this.style.getPropertyValue('--blue-400').trim() || '#60A5FA',
    this.style.getPropertyValue('--green-400').trim() || '#4ADE80',
    this.style.getPropertyValue('--yellow-400').trim() || '#FACC15',
    this.style.getPropertyValue('--orange-400').trim() || '#FB923C',
    this.style.getPropertyValue('--red-400').trim() || '#F87171',
    this.style.getPropertyValue('--purple-400').trim() || '#C084FC',
  ];

  readonly chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: this.style.getPropertyValue('--text-color').trim() },
      },
    },
    scales: {
      x: { ticks: { color: this.style.getPropertyValue('--text-color-secondary').trim() } },
      y: { ticks: { color: this.style.getPropertyValue('--text-color-secondary').trim() } },
    },
  };

  readonly title = computed<string>(() => {
    const props = this.component().properties as LineChartProperties;
    return this.resolvePrimitive(props.titleText ?? null) ?? '';
  });

  readonly chartData = computed(() => {
    const props = this.component().properties as LineChartProperties;
    try {
      const labels = JSON.parse(
        this.resolvePrimitive(props.labelsJson ?? null) ?? '[]',
      ) as string[];
      const raw = JSON.parse(
        this.resolvePrimitive(props.datasetsJson ?? null) ?? '[]',
      ) as { label: string; data: number[] }[];
      const datasets = raw.map((ds, i) => ({
        ...ds,
        borderColor: this.palette[i % this.palette.length],
        backgroundColor: this.palette[i % this.palette.length] + '33',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
      }));
      return { labels, datasets };
    } catch {
      return { labels: [], datasets: [] };
    }
  });
}
