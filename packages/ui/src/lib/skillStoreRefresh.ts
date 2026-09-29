import type { ISkillsService } from "@qcode/services";
import {
  normalizeAgentProviderToQCodeAgent,
  QCODE_AGENT_PROVIDER,
  type QCodeProvider,
} from "@qcode/shared";
import { useSkillStore } from "@/store/skillStore.js";

export async function refreshSharedSkillStoreForWorkspace(params: {
  workspacePath: string | null | undefined;
  workspaceIdentity?: string | null;
  skillsService: ISkillsService;
  provider?: QCodeProvider;
}): Promise<void> {
  const workspacePath = params.workspacePath;
  if (!workspacePath) {
    return;
  }
  const skillStore = useSkillStore.getState();
  const normalizedWorkspaceIdentity = params.workspaceIdentity?.trim() || null;
  const normalizedProvider = normalizeAgentProviderToQCodeAgent(
    params.provider ?? QCODE_AGENT_PROVIDER,
  );
  const refreshes: Promise<void>[] = [];

  if (
    skillStore.workspacePath === workspacePath &&
    skillStore.workspaceIdentity === normalizedWorkspaceIdentity &&
    skillStore.loadedWorkspacePath === workspacePath &&
    skillStore.loadedWorkspaceIdentity === normalizedWorkspaceIdentity &&
    normalizeAgentProviderToQCodeAgent(skillStore.provider) === normalizedProvider &&
    skillStore.loadedProvider === normalizedProvider
  ) {
    refreshes.push(
      skillStore.refresh(params.skillsService, normalizedWorkspaceIdentity ?? undefined),
    );
  }

  await Promise.all(refreshes);
}
