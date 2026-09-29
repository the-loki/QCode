import { useShallow } from "zustand/react/shallow";
import {
  getWorkspaceDisplayedTaskState,
  selectWorkspaceQCodeState,
  useQCodeSessionStore,
  type WorkspaceQCodeUIState,
} from "@/store/qcodeSessionStore.js";
import { resolveWorkspaceModelConfigSyncScope } from "@/lib/modelConfigSync.js";
import { hasBusyTaskInWorkspaceProvider } from "@/lib/workspaceBusyTaskLock.js";

type WorkspaceShellQCodeState = Pick<
  WorkspaceQCodeUIState,
  | "activeTaskId"
  | "draftFocusVersion"
  | "modelSwitchPending"
  | "modelSwitchStage"
  | "selectedProvider"
  | "selectedSupplierKey"
  | "configOptions"
  | "optimisticTaskListByTaskId"
  | "workspaceInit"
> &
  ReturnType<typeof getWorkspaceDisplayedTaskState>;

export function useWorkspaceShellQCodeState(workspaceAbsPath: string, workspaceIdentity?: string) {
  // App 之前直接订阅整个 workspaceQCodeState，streaming 每个 chunk 都会改 taskMessagesByTaskId。
  // 这会把侧边栏、Header、Git 派生逻辑一起拖进同步重渲染，性能 trace 里那串 long task 就是这样被放大的。
  // 这里把外壳真正依赖的字段收敛成浅比较选择器，避免消息流惊动无关 UI。
  const workspaceShellQCodeState = useQCodeSessionStore(
    useShallow((state): WorkspaceShellQCodeState => {
      const workspaceState = selectWorkspaceQCodeState(state, workspaceAbsPath, workspaceIdentity);
      const displayedTaskState = getWorkspaceDisplayedTaskState(workspaceState);
      return {
        activeTaskId: workspaceState.activeTaskId,
        draftFocusVersion: workspaceState.draftFocusVersion,
        modelSwitchPending: workspaceState.modelSwitchPending,
        modelSwitchStage: workspaceState.modelSwitchStage,
        selectedProvider: workspaceState.selectedProvider,
        selectedSupplierKey: workspaceState.selectedSupplierKey,
        configOptions: workspaceState.configOptions,
        optimisticTaskListByTaskId: workspaceState.optimisticTaskListByTaskId,
        workspaceInit: workspaceState.workspaceInit,
        taskStatus: displayedTaskState.taskStatus,
        taskError: displayedTaskState.taskError,
      };
    }),
  );

  const reloadSessionDisabled = useQCodeSessionStore((state) => {
    const workspaceState = selectWorkspaceQCodeState(state, workspaceAbsPath, workspaceIdentity);
    const actionScope = resolveWorkspaceModelConfigSyncScope(workspaceState);
    return hasBusyTaskInWorkspaceProvider(
      actionScope.provider,
      workspaceState.taskRuntimeByTaskId,
      workspaceState.optimisticTaskListByTaskId,
      workspaceState.taskListCache,
      workspaceState.activeTaskId,
    );
  });

  return { workspaceShellQCodeState, reloadSessionDisabled };
}
