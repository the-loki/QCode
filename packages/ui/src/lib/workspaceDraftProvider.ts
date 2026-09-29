import type { QCodeProvider } from "@qcode/shared";
import type { WorkspaceQCodeUIState } from "@/store/qcodeSessionStore.js";

interface ResolveWorkspaceSwitchDraftProviderOptions {
  currentSelectedProvider: QCodeProvider;
  targetWorkspacePath: string;
  targetWorkspaceIdentity?: string;
  workspaces: Record<string, WorkspaceQCodeUIState | undefined>;
}

export function resolveWorkspaceSwitchDraftProvider({
  currentSelectedProvider,
  targetWorkspacePath,
  targetWorkspaceIdentity,
  workspaces,
}: ResolveWorkspaceSwitchDraftProviderOptions): QCodeProvider {
  const workspaceKey = targetWorkspaceIdentity?.trim() || targetWorkspacePath;
  const targetWorkspaceState = workspaces[workspaceKey] ?? workspaces[targetWorkspacePath];

  // 空态里切换 workspace 后直接新建草稿时，之前总把“来源 workspace 当前选中的 Agent”
  // 强行写给目标 workspace，导致目标项目自己刚用过的 Agent 被覆盖。
  // 这里优先沿用目标 workspace 已记住的 provider，只在目标还没建立 UI 状态时才继承当前选择。
  return targetWorkspaceState?.selectedProvider ?? currentSelectedProvider;
}
