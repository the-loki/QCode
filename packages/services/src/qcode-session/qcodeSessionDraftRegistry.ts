import type { QCodeSessionStateSnapshot } from "@qcode/shared";
import type {
  QCodeSessionWorkspaceTarget,
  QCodeTaskTarget,
} from "#src/qcode-session/qcodeSession.js";

function getWorkspaceKey(target: QCodeSessionWorkspaceTarget): string {
  return target.workspaceIdentity?.trim() || target.workspacePath;
}

function getSessionScopedKey(target: QCodeTaskTarget): string {
  return `${getWorkspaceKey(target)}\0${target.sessionId}`;
}

export function createQCodeDeferredDraftRegistry() {
  const sessionKeys = new Set<string>();

  return {
    remember(params: QCodeSessionWorkspaceTarget, snapshot: QCodeSessionStateSnapshot): void {
      sessionKeys.add(
        getSessionScopedKey({
          workspacePath: snapshot.session.workspace.workspacePath,
          workspaceIdentity:
            snapshot.session.workspace.workspaceIdentity ?? params.workspaceIdentity,
          sessionId: snapshot.session.sessionId,
        }),
      );
    },

    has(target: QCodeTaskTarget): boolean {
      return sessionKeys.has(getSessionScopedKey(target));
    },

    forget(target: QCodeTaskTarget): void {
      sessionKeys.delete(getSessionScopedKey(target));
    },
  };
}
