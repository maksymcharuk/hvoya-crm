import { Catalog, DEFAULT_CATALOG } from '@a2ui/angular';
import type { Theme } from '@a2ui/angular';

import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { DataTableComponent } from '../components/data-table/data-table.component';
import { LineChartComponent } from '../components/line-chart/line-chart.component';
import { PieChartComponent } from '../components/pie-chart/pie-chart.component';

/**
 * Minimal theme — A2UI structural styles are injected by the Renderer directive;
 * we don't need class-based theme overrides here.
 */
export const HVOYA_THEME: Theme = {
  components: {
    AudioPlayer: {},
    Button: {},
    Card: {},
    Column: {},
    CheckBox: { container: {}, element: {}, label: {} },
    DateTimeInput: { container: {}, element: {}, label: {} },
    Divider: {},
    Image: {
      all: {},
      icon: {},
      avatar: {},
      smallFeature: {},
      mediumFeature: {},
      largeFeature: {},
      header: {},
    },
    Icon: {},
    List: {},
    Modal: { backdrop: {}, element: {} },
    MultipleChoice: { container: {}, element: {}, label: {} },
    Row: {},
    Slider: { container: {}, element: {}, label: {} },
    Tabs: { container: {}, element: {}, controls: { all: {}, selected: {} } },
    Text: { all: {}, h1: {}, h2: {}, h3: {}, h4: {}, h5: {}, caption: {}, body: {} },
    TextField: { container: {}, element: {}, label: {} },
    Video: {},
  },
  elements: {
    a: {},
    audio: {},
    body: {},
    button: {},
    h1: {},
    h2: {},
    h3: {},
    h4: {},
    h5: {},
    iframe: {},
    input: {},
    p: {},
    pre: {},
    textarea: {},
    video: {},
  },
  markdown: {
    p: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    ul: [],
    ol: [],
    li: [],
    a: [],
    strong: [],
    em: [],
  },
};

/**
 * Custom Hvoya catalog — extends the standard A2UI catalog with app-specific
 * components. Registered via provideA2UI() in AppModule.
 *
 * Custom components:
 *   DataTable — renders tabular analytics data as a PrimeNG p-table.
 *               The backend sends `columnsJson` and `rowsJson` as JSON strings.
 */
export const HVOYA_CATALOG: Catalog = {
  ...DEFAULT_CATALOG,

  // DataTableComponent resolves its own properties via resolvePrimitive() —
  // no custom bindings needed here.
  DataTable: () => DataTableComponent,
  BarChart: () => BarChartComponent,
  LineChart: () => LineChartComponent,
  PieChart: () => PieChartComponent,
};
