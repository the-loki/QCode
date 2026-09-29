import type {
  QCodeAgentMcpServer,
  QCodeAutomationScheduleRule,
  QCodeMcpListMode,
  ModelSelection,
} from "@qcode/shared";

export interface QCodeAgentWorkspaceTarget {
  workspacePath: string;
  workspaceIdentity?: string;
  /** 远程 workspace 的运行时会话身份；只用于隔离/路由，不能替代 workspacePath。 */
  remoteSessionId?: string;
}

export interface QCodeAgentPluginViewParams extends QCodeAgentWorkspaceTarget {
  configScope?: "user" | "workspace";
}

export interface QCodeAgentListMcpServerStatusesParams extends QCodeAgentWorkspaceTarget {
  mcpServers?: QCodeAgentMcpServer[];
  mode?: QCodeMcpListMode;
}

export interface QCodeAgentAddPluginMarketplaceParams extends QCodeAgentWorkspaceTarget {
  dryRun?: boolean;
  operationId?: string;
  source: string;
}

export interface QCodeAgentRemovePluginMarketplaceParams extends QCodeAgentWorkspaceTarget {
  marketplace: string;
}

export interface QCodeAgentUpdatePluginMarketplaceParams extends QCodeAgentWorkspaceTarget {
  marketplace?: string;
  operationId?: string;
}

export interface QCodeAgentInstallPluginParams extends QCodeAgentWorkspaceTarget {
  dryRun?: boolean;
  marketplace: string;
  operationId?: string;
  pluginName: string;
  scope?: "user" | "workspace";
}

export interface QCodeAgentCancelPluginOperationParams {
  operationId: string;
}

export interface QCodeAgentUninstallPluginParams extends QCodeAgentWorkspaceTarget {
  marketplace?: string;
  pluginId?: string;
  pluginName?: string;
  removeCache?: boolean;
}

export interface QCodeAgentUpdatePluginParams extends QCodeAgentWorkspaceTarget {
  pluginId?: string;
  marketplace?: string;
}

export interface QCodeAgentRestoreBuiltinPluginParams extends QCodeAgentWorkspaceTarget {
  pluginId: string;
}

export interface QCodeAgentConfigurePluginParams extends QCodeAgentWorkspaceTarget {
  clearOptionKeys?: string[];
  dryRun?: boolean;
  options: Record<string, unknown>;
  pluginId: string;
  scope?: "user" | "workspace";
}

export interface QCodeAgentResetPluginConfigParams extends QCodeAgentWorkspaceTarget {
  pluginId: string;
  scope?: "user" | "workspace";
}

export interface QCodeAgentValidatePluginParams extends QCodeAgentWorkspaceTarget {
  marketplace?: string;
  pluginName?: string;
  source?: string;
}

export interface QCodeAgentDescribePluginParams extends QCodeAgentWorkspaceTarget {
  marketplace: string;
  pluginName: string;
}

export interface QCodeAgentSetPluginEnabledParams extends QCodeAgentWorkspaceTarget {
  enabled: boolean;
  operationId?: string;
  pluginId: string;
  scope?: "user" | "workspace";
}

// Plugin 对话引用 catalog：
// 带 sessionId → session-owned 冻结 catalog（必须路由到持有该 session 的 workspace client）；
// 不带 → workspace 当前 catalog（新建草稿 Picker）。
export interface QCodeAgentPluginReferenceCatalogParams extends QCodeAgentWorkspaceTarget {
  sessionId?: string;
}

// Composer Skill catalog：与 Plugin 引用相同，以 sessionId 区分 workspace 当前目录和
// resident Session runtime 快照；不参与 Settings 管理目录。
export interface QCodeAgentSkillReferenceCatalogParams extends QCodeAgentWorkspaceTarget {
  sessionId?: string;
}
export interface QCodeAgentResolveSuggestedPluginReferenceParams extends QCodeAgentWorkspaceTarget {
  stableId: string;
  operationId: string;
  clientMode: "desktop-continuous" | "web-remote-replayable";
  deliveryKind: "desktop-continuous" | "web-remote-replayable";
}

// ---- 定时任务(automation)管理参数 ----

export interface QCodeAgentCreateAutomationParams extends QCodeAgentWorkspaceTarget {
  title: string;
  cronExpr: string;
  relativeDelayMinutes?: number;
  prompt: string;
  modelSelection?: ModelSelection;
  mode?: string;
  recurring?: boolean;
  maxRuns?: number;
  endAt?: number;
  scheduleRule?: QCodeAutomationScheduleRule;
}

export interface QCodeAgentUpdateAutomationParams extends QCodeAgentWorkspaceTarget {
  automationId: string;
  title?: string;
  cronExpr?: string;
  prompt?: string;
  modelSelection?: ModelSelection | null;
  mode?: string | null;
  recurring?: boolean;
  maxRuns?: number | null;
  endAt?: number | null;
  scheduleRule?: QCodeAutomationScheduleRule | null;
  scheduleEditedByUser?: boolean;
}

export interface QCodeAgentAutomationIdParams extends QCodeAgentWorkspaceTarget {
  automationId: string;
}

export interface QCodeAgentSetAutomationEnabledParams extends QCodeAgentWorkspaceTarget {
  automationId: string;
  enabled: boolean;
}

export interface QCodeAgentDeleteAutomationRunParams extends QCodeAgentWorkspaceTarget {
  runId: string;
}
