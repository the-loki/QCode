import type { Event, IDisposable } from "@qcode/rpc";
import type { QCodeProtocolMessage } from "@qcode/shared";

export type QCodeProtocolTransportKind = "stdio" | "websocket" | "memory";

export interface QCodeProtocolTransportClosedEvent {
  code?: number | null;
  signal?: NodeJS.Signals | null;
  reason?: string;
}

export interface QCodeProtocolTransport extends IDisposable {
  readonly kind: QCodeProtocolTransportKind;
  readonly onMessage: Event<QCodeProtocolMessage>;
  readonly onClose: Event<QCodeProtocolTransportClosedEvent>;
  send(message: QCodeProtocolMessage): Promise<void>;
  disposeAndWait?(): Promise<void>;
}
