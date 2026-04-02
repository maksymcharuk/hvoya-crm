import { DynamicComponent } from '@a2ui/angular';
import { TableModule } from 'primeng/table';

import { Component, computed } from '@angular/core';

export interface DataTableColumn {
  field: string;
  header: string;
}

interface DataTableProperties {
  columnsJson?: {
    literalString?: string;
    literal?: string;
    path?: string;
  } | null;
  rowsJson?: { literalString?: string; literal?: string; path?: string } | null;
}

@Component({
  standalone: true,
  selector: 'hvoya-data-table',
  imports: [TableModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent extends DynamicComponent {
  readonly columns = computed<DataTableColumn[]>(() => {
    const props = this.component().properties as DataTableProperties;
    const json = this.resolvePrimitive(props.columnsJson ?? null);
    try {
      return json ? (JSON.parse(json) as DataTableColumn[]) : [];
    } catch {
      return [];
    }
  });

  readonly rows = computed<Record<string, unknown>[]>(() => {
    const props = this.component().properties as DataTableProperties;
    const json = this.resolvePrimitive(props.rowsJson ?? null);
    try {
      return json ? (JSON.parse(json) as Record<string, unknown>[]) : [];
    } catch {
      return [];
    }
  });
}
