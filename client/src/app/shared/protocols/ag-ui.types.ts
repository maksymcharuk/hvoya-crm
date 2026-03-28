/**
 * AG-UI Protocol — event types for agent-to-UI streaming.
 * https://github.com/ag-ui-protocol/ag-ui
 *
 * Events arrive over SSE as: event: agui\ndata: <json>\n\n
 */

export interface AguiRunStartEvent {
  type: 'RUN_START';
}

export interface AguiRunFinishEvent {
  type: 'RUN_FINISH';
}

export interface AguiRunErrorEvent {
  type: 'RUN_ERROR';
  error: string;
}

export interface AguiTextMessageStartEvent {
  type: 'TEXT_MESSAGE_START';
  messageId: string;
}

export interface AguiTextMessageContentEvent {
  type: 'TEXT_MESSAGE_CONTENT';
  messageId: string;
  delta: string;
}

export interface AguiTextMessageEndEvent {
  type: 'TEXT_MESSAGE_END';
  messageId: string;
}

export interface AguiToolCallStartEvent {
  type: 'TOOL_CALL_START';
  toolCallId: string;
  toolName: string;
}

export interface AguiToolCallEndEvent {
  type: 'TOOL_CALL_END';
  toolCallId: string;
}

export type AguiEvent =
  | AguiRunStartEvent
  | AguiRunFinishEvent
  | AguiRunErrorEvent
  | AguiTextMessageStartEvent
  | AguiTextMessageContentEvent
  | AguiTextMessageEndEvent
  | AguiToolCallStartEvent
  | AguiToolCallEndEvent;
