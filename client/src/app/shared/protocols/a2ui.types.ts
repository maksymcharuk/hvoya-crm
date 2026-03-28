/**
 * A2UI Protocol — declarative agent-driven UI messages.
 * https://github.com/google/A2UI
 *
 * Messages arrive over SSE as: event: a2ui\ndata: <json>\n\n
 *
 * The agent sends a component tree (surfaceUpdate) and separate data (dataModelUpdate).
 * Components reference data via { path: '/key' } bound values — decoupling structure from data.
 */

// ----- Bound values -----

/** A value that is either a literal or a reference into the data model. */
export interface A2uiBoundValue {
  /** Static string value. */
  literalString?: string;
  /** Path into the data model, e.g. '/result' or '/result/json'. */
  path?: string;
}

// ----- Component tree -----

/**
 * A single node in the component tree.
 * `component` is a one-key object: { ComponentName: { prop: BoundValue, ... } }
 */
export interface A2uiComponentNode {
  id: string;
  component: Record<string, Record<string, A2uiBoundValue>>;
}

// ----- Server-to-client messages -----

/** Initialises a surface and declares the root component id. */
export interface A2uiBeginRenderingMessage {
  beginRendering: {
    surfaceId: string;
    /** Identifies which component catalog the agent expects to use. */
    catalogId: string;
    /** Id of the root component node. */
    root: string;
  };
}

/** Adds or updates components in the surface's component tree. */
export interface A2uiSurfaceUpdateMessage {
  surfaceUpdate: {
    surfaceId: string;
    components: A2uiComponentNode[];
  };
}

/** Key-value content item inside a dataModelUpdate. */
export interface A2uiDataModelContent {
  key: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueNumber?: number;
}

/** Updates the data model at a given path; components with matching path bindings re-render. */
export interface A2uiDataModelUpdateMessage {
  dataModelUpdate: {
    surfaceId: string;
    /** Root key in the data model, e.g. 'result'. */
    path: string;
    contents: A2uiDataModelContent[];
  };
}

export type A2uiMessage =
  | A2uiBeginRenderingMessage
  | A2uiSurfaceUpdateMessage
  | A2uiDataModelUpdateMessage;
