import { DynamicComponent, Renderer } from '@a2ui/angular';
import type { Types } from '@a2ui/lit/0.8';
import { TableModule } from 'primeng/table';

import { Component, computed } from '@angular/core';

@Component({
  standalone: true,
  selector: 'hvoya-data-table',
  imports: [TableModule, Renderer],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent extends DynamicComponent {
  readonly columnTitles = computed<string[]>(() => {
    const props = this.component().properties as Types.CustomNodeProperties;
    const specs = (props['columnSpecs'] as Types.ResolvedArray) ?? [];
    return specs.map((s) => ((s as Types.ResolvedMap)['title'] as string) ?? '');
  });

  readonly tableRows = computed<Types.AnyComponentNode[]>(() => {
    const props = this.component().properties as Types.CustomNodeProperties;
    return ((props['rows'] as Types.ResolvedArray) ?? []) as Types.AnyComponentNode[];
  });

  getCellNodes(rowNode: Types.AnyComponentNode): Types.AnyComponentNode[] {
    const props = (rowNode as Types.CustomNode).properties;
    return ((props['cells'] as Types.ResolvedArray) ?? []) as Types.AnyComponentNode[];
  }
}
