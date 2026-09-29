import { ServiceChannels } from "@qcode/shared";
import type {
  TraceId,
  QCodeAgentMcpServer,
  QCodeDeliveryKind,
  QCodeMessageWithParts,
  ModelSelection,
  QCodePermissionRequestParams,
  QCodeUserInputRequestParams,
  QCodeUserInputResponse,
  QCodeSessionInfo,
  QCodeSessionImportHistory,
  QCodeSessionEvent,
  QCodeSessionMode,
  QCodeSessionPersistence,
  QCodeSessionStateSnapshot,
  QCodeStateUpdatedNotification,
  QCodeWorkspacePresentation,
} from "@qcode/shared";
import { createServiceDescriptor } from "#src/descriptors.js";

export interface QCodeSessionWorkspaceTarget {
  workspacePath: string;
  workspaceIdentity?: string;
  remoteSessionId?: string;
}

export type QCodeSessionReadWorkspacePresentationParams = QCodeSessionWorkspaceTarget;

export interface QCodeTaskTarget extends QCodeSessionWorkspaceTarget {
  sessionId: string;
}

export interface QCodeSessionCreateParams extends QCodeSessionWorkspaceTarget {
  /** 仅导入事务使用的预分配 ID；普通新会话继续由 Agent 分配。 */
  sessionId?: string;
  sessionTraceId?: TraceId;
  parentSessionId?: string;
  mode?: QCodeSessionMode;
  model?: ModelSelection;
  persistence?: QCodeSessionPersistence;
  thoughtLevel?: string;
  mcpServers?: QCodeAgentMcpServer[];
  importedHistory?: QCodeSessionImportHistory;
}

export interface QCodeSessionResumeParams extends QCodeTaskTarget {
  model?: ModelSelection;
  thoughtLevel?: string;
  mcpServers?: QCodeAgentMcpServer[];
  /**
   * 默认广播 resume 得到的历史快照，并让 shadow 订阅请求初始 snapshot。
   * 续聊发送前的 runtime 预恢复会关闭它，避免旧终态快照覆盖本地已开始的新输入运行态。
   */
  broadcastSnapshot?: boolean;
}

export interface QCodeSessionListParams extends QCodeSessionWorkspaceTarget {
  includeArchived?: boolean;
  limit?: number;
}

export interface QCodeSessionReadParams extends QCodeTaskTarget {
  deliveryKind?: QCodeDeliveryKind;
  messageLimit?: number;
  afterSeq?: number;
}

export interface QCodeSessionMessagesParams extends QCodeTaskTarget {
  afterMessageId?: string;
  limit?: number;
}

export interface QCodeSessionEventsParams extends QCodeTaskTarget {
  afterSeq?: number;
  limit?: number;
}

export interface QCodeSessionSetModelParams extends QCodeTaskTarget {
  model: ModelSelection;
  expectedRevision?: number;
  persistAsWorkspaceLastUsed?: boolean;
}

export interface QCodeSessionSetThoughtLevelParams extends QCodeTaskTarget {
  thoughtLevel?: string;
  expectedRevision?: number;
  persistAsWorkspaceLastUsed?: boolean;
}

export interface QCodeSessionSetModeParams extends QCodeTaskTarget {
  mode: QCodeSessionMode;
  expectedRevision?: number;
}

export interface QCodeSessionSubscribeParams extends QCodeTaskTarget {
  deliveryKind: QCodeDeliveryKind;
  afterSeq?: number;
  includeSnapshot?: boolean;
  eventCoalescing?: {
    mode: "background-summary";
    intervalMs?: number;
  };
}

export type QCodeSessionServiceEvent =
  | { type: "session.event"; event: QCodeSessionEvent }
  | { type: "state.updated"; notification: QCodeStateUpdatedNotification }
  | { type: "permission.request"; request: QCodePermissionRequestParams }
  | { type: "userInput.request"; request: QCodeUserInputRequestParams }
  | {
      type: "userInput.response";
      requestId: string;
      response: QCodeUserInputResponse;
    }
  | { type: "snapshot"; snapshot: QCodeSessionStateSnapshot };

export interface QCodeSessionInitializeResult {
  available: boolean;
  workspaceKey: string;
  protocolName?: string;
  protocolVersion?: number;
  transportKind?: "stdio" | "websocket";
  reason?: string;
  reasonCode?: "provider_not_ready";
}

export interface QCodeSessionWorkspaceRuntimeIdentity {
  generation: number;
  identity: string;
  processId?: number;
  workspaceKey: string;
}

export interface IQCodeSessionService {
  initializeWorkspace(params: QCodeSessionWorkspaceTarget): Promise<QCodeSessionInitializeResult>;
  getWorkspaceRuntimeIdentity(
    params: QCodeSessionWorkspaceTarget,
  ): Promise<QCodeSessionWorkspaceRuntimeIdentity>;
  readWorkspacePresentation(
    params: QCodeSessionReadWorkspacePresentationParams,
  ): Promise<QCodeWorkspacePresentation>;
  createSession(params: QCodeSessionCreateParams): Promise<QCodeSessionStateSnapshot>;
  resumeSession(params: QCodeSessionResumeParams): Promise<QCodeSessionStateSnapshot>;
  listSessions(params: QCodeSessionListParams): Promise<QCodeSessionInfo[]>;
  readSession(params: QCodeSessionReadParams): Promise<QCodeSessionStateSnapshot>;
  readSessionMessages(params: QCodeSessionMessagesParams): Promise<QCodeMessageWithParts[]>;
  readSessionEvents(params: QCodeSessionEventsParams): Promise<QCodeSessionEvent[]>;
  promoteDeferredDraftSession(params: QCodeTaskTarget): Promise<void>;
  closeSession(params: QCodeTaskTarget): Promise<void>;
  closeDeferredDraftSession(params: QCodeTaskTarget): Promise<boolean>;
  setModel(params: QCodeSessionSetModelParams): Promise<QCodeSessionStateSnapshot>;
  setThoughtLevel(params: QCodeSessionSetThoughtLevelParams): Promise<QCodeSessionStateSnapshot>;
  setMode(params: QCodeSessionSetModeParams): Promise<QCodeSessionStateSnapshot>;
  // renderer 订阅面走 agentService 的 conversation/sessions-index 帧通道。
}

export const IQCodeSessionService = createServiceDescriptor<IQCodeSessionService>(
  ServiceChannels.QCodeSession,
);
