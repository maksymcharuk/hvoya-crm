/**
 * A2UI Surface — minimal client-side state machine for the A2UI protocol.
 *
 * Processes the three server-to-client message types and maintains the surface state:
 *   beginRendering  → initialises the surface, sets the root component id
 *   surfaceUpdate   → adds/replaces component nodes in the tree
 *   dataModelUpdate → stores key-value data; resolves path bindings on demand
 *
 * Usage:
 *   const surface = new A2uiSurface();
 *   surface.processMessage(msg);               // call for each incoming a2ui SSE event
 *   const root = surface.getRootResolved();    // get the root component with props resolved
 */

import { A2uiBoundValue, A2uiComponentNode, A2uiMessage } from './a2ui.types';

/** A component node with all bound values already resolved to concrete values. */
export interface ResolvedComponent {
  id: string;
  /** The name from the catalog, e.g. 'AnalyticsViz'. */
  componentName: string;
  /** Props with path references replaced by their data model values. */
  props: Record<string, unknown>;
}

export class A2uiSurface {
  private rootId: string | null = null;
  private components = new Map<string, A2uiComponentNode>();
  private dataModel = new Map<string, Record<string, unknown>>();

  processMessage(msg: A2uiMessage): void {
    if ('beginRendering' in msg) {
      // Reset and initialise
      this.rootId = msg.beginRendering.root;
      this.components.clear();
      this.dataModel.clear();
    } else if ('surfaceUpdate' in msg) {
      for (const node of msg.surfaceUpdate.components) {
        this.components.set(node.id, node);
      }
    } else if ('dataModelUpdate' in msg) {
      const record: Record<string, unknown> = {};
      for (const item of msg.dataModelUpdate.contents) {
        record[item.key] =
          item.valueString !== undefined ? item.valueString
          : item.valueBoolean !== undefined ? item.valueBoolean
          : item.valueNumber;
      }
      this.dataModel.set(msg.dataModelUpdate.path, record);
    }
  }

  /**
   * Returns the root component with all prop bindings resolved.
   * Returns null if the surface hasn't received beginRendering yet,
   * or if data hasn't arrived yet (path bindings unresolvable).
   */
  getRootResolved(): ResolvedComponent | null {
    if (!this.rootId) return null;
    const node = this.components.get(this.rootId);
    if (!node) return null;

    const entries = Object.entries(node.component);
    if (!entries.length) return null;
    const [componentName, rawProps] = entries[0]!;

    const props: Record<string, unknown> = {};
    for (const [key, boundVal] of Object.entries(rawProps)) {
      props[key] = this.resolve(boundVal);
    }

    return { id: node.id, componentName, props };
  }

  get isReady(): boolean {
    return this.rootId !== null && this.components.size > 0 && this.dataModel.size > 0;
  }

  reset(): void {
    this.rootId = null;
    this.components.clear();
    this.dataModel.clear();
  }

  private resolve(bound: A2uiBoundValue): unknown {
    if (bound.literalString !== undefined) return bound.literalString;
    if (bound.path) {
      // Path format: '/recordKey' or '/recordKey/fieldKey'
      const parts = bound.path.replace(/^\//, '').split('/');
      const record = this.dataModel.get(parts[0]!);
      if (!record) return undefined;
      return parts[1] ? record[parts[1]] : record;
    }
    return undefined;
  }
}
