import { Component, Input } from '@angular/core';

import type {
  AnyComponentNode,
  ButtonNode,
  CardNode,
  CheckboxNode,
  ColumnNode,
  CustomNode,
  DividerNode,
  ListNode,
  ModalNode,
  MultipleChoiceNode,
  RowNode,
  SliderNode,
  TabsNode,
  TextFieldNode,
  TextNode,
} from '@a2ui/web_core';

@Component({
  standalone: false,
  selector: 'app-a2ui-renderer',
  templateUrl: './a2ui-renderer.component.html',
  styleUrls: ['./a2ui-renderer.component.scss'],
})
export class A2uiRendererComponent {
  @Input() node: AnyComponentNode | null = null;

  private readonly activeTabs = new Map<string, number>();

  getTextNode(node: AnyComponentNode): TextNode {
    return node as TextNode;
  }

  getRowNode(node: AnyComponentNode): RowNode {
    return node as RowNode;
  }

  getColumnNode(node: AnyComponentNode): ColumnNode {
    return node as ColumnNode;
  }

  getListNode(node: AnyComponentNode): ListNode {
    return node as ListNode;
  }

  getCardNode(node: AnyComponentNode): CardNode {
    return node as CardNode;
  }

  getButtonNode(node: AnyComponentNode): ButtonNode {
    return node as ButtonNode;
  }

  getDividerNode(node: AnyComponentNode): DividerNode {
    return node as DividerNode;
  }

  getTabsNode(node: AnyComponentNode): TabsNode {
    return node as TabsNode;
  }

  getModalNode(node: AnyComponentNode): ModalNode {
    return node as ModalNode;
  }

  getCheckboxNode(node: AnyComponentNode): CheckboxNode {
    return node as CheckboxNode;
  }

  getTextFieldNode(node: AnyComponentNode): TextFieldNode {
    return node as TextFieldNode;
  }

  getMultipleChoiceNode(node: AnyComponentNode): MultipleChoiceNode {
    return node as MultipleChoiceNode;
  }

  getSliderNode(node: AnyComponentNode): SliderNode {
    return node as SliderNode;
  }

  getCustomNode(node: AnyComponentNode): CustomNode {
    return node as CustomNode;
  }

  getTextClass(node: TextNode): string {
    const usageHint = node.properties.usageHint ?? 'body';
    return `a2ui-text a2ui-text-${usageHint}`;
  }

  getDisplayValue(value: unknown): string {
    if (value === null || value === undefined) return '—';

    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);

    if (Array.isArray(value)) {
      return value.map((item) => this.getDisplayValue(item)).join(', ');
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;

      if (typeof record['literalString'] === 'string') {
        return record['literalString'];
      }

      if (typeof record['literal'] === 'string') {
        return record['literal'];
      }

      if (typeof record['text'] === 'string') {
        return record['text'];
      }

      if (typeof record['label'] === 'string') {
        return record['label'];
      }

      if (typeof record['value'] === 'string') {
        return record['value'];
      }
    }

    return this.stringifyValue(value);
  }

  getContainerClass(type: 'Row' | 'Column' | 'List', node: RowNode | ColumnNode | ListNode): string {
    if (type === 'List') {
      const direction = (node as ListNode).properties.direction ?? 'vertical';
      return `a2ui-list a2ui-list-${direction}`;
    }

    return type === 'Row' ? 'a2ui-row' : 'a2ui-column';
  }

  getContainerStyles(node: RowNode | ColumnNode | ListNode): Record<string, string> {
    const distribution = 'distribution' in node.properties ? node.properties.distribution : undefined;
    const alignment = node.properties.alignment;

    return {
      justifyContent: this.mapDistribution(distribution),
      alignItems: this.mapAlignment(alignment),
    };
  }

  getWeight(node: AnyComponentNode): string | number {
    return typeof node.weight === 'number' ? node.weight : 1;
  }

  getActiveTabIndex(node: TabsNode): number {
    return this.activeTabs.get(node.id) ?? 0;
  }

  setActiveTab(node: TabsNode, index: number): void {
    this.activeTabs.set(node.id, index);
  }

  getCustomPropertyEntries(node: CustomNode): Array<{ key: string; value: string }> {
    return Object.entries(node.properties).map(([key, value]) => ({
      key,
      value: this.getDisplayValue(value),
    }));
  }

  getMultipleChoiceOptions(node: MultipleChoiceNode): Array<{ label: string; value: string }> {
    const options = (node.properties as any).options;
    if (!Array.isArray(options)) return [];

    return options.map((option) => ({
      label: this.getDisplayValue(option?.label),
      value: this.getDisplayValue(option?.value),
    }));
  }

  isMultipleChoiceSelected(node: MultipleChoiceNode, value: string): boolean {
    const selections = (node.properties as any).selections;
    return Array.isArray(selections) ? selections.includes(value) : false;
  }

  stringifyValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  trackNode(_: number, node: AnyComponentNode): string {
    return node.id;
  }

  trackTab(index: number): number {
    return index;
  }

  private mapDistribution(
    value?: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly',
  ): string {
    switch (value) {
      case 'center':
        return 'center';
      case 'end':
        return 'flex-end';
      case 'spaceBetween':
        return 'space-between';
      case 'spaceAround':
        return 'space-around';
      case 'spaceEvenly':
        return 'space-evenly';
      default:
        return 'flex-start';
    }
  }

  private mapAlignment(value?: 'start' | 'center' | 'end' | 'stretch'): string {
    switch (value) {
      case 'center':
        return 'center';
      case 'end':
        return 'flex-end';
      case 'stretch':
        return 'stretch';
      default:
        return 'flex-start';
    }
  }
}
