const QCODE_PROCESS_PREFIX = "qcode";
const MAX_PROCESS_NAME_SEGMENT_LENGTH = 24;

function sanitizeProcessNameSegment(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, MAX_PROCESS_NAME_SEGMENT_LENGTH);
}

function joinQCodeProcessName(...segments: Array<string | null | undefined>): string {
  const sanitizedSegments = segments
    .map((segment) => sanitizeProcessNameSegment(segment))
    .filter((segment): segment is string => Boolean(segment));
  return [QCODE_PROCESS_PREFIX, ...sanitizedSegments].join("-");
}

function pickWorkspaceTag(workspacePath: string | null | undefined): string | undefined {
  const trimmedPath = workspacePath?.trim();
  if (!trimmedPath) {
    return undefined;
  }

  const parts = trimmedPath.split(/[\\/]+/).filter(Boolean);
  return parts.at(-1) ?? trimmedPath;
}

export function formatQCodeMainProcessName(): string {
  return joinQCodeProcessName("main");
}

export function formatQCodeGpuProcessName(): string {
  return joinQCodeProcessName("gpu");
}

export function formatQCodeHostProcessName(label?: string): string {
  return joinQCodeProcessName("host", label);
}

export function formatQCodeRendererProcessName(windowTitle?: string): string {
  const normalizedTitle = windowTitle?.trim();
  if (!normalizedTitle || normalizedTitle === "QCode") {
    return joinQCodeProcessName("renderer", "main");
  }

  if (normalizedTitle === "Resource Manager") {
    return joinQCodeProcessName("renderer", "resource-manager");
  }

  const remoteWindowPrefix = "QCode - ";
  if (normalizedTitle.startsWith(remoteWindowPrefix)) {
    return joinQCodeProcessName(
      "renderer",
      "remote",
      normalizedTitle.slice(remoteWindowPrefix.length),
    );
  }

  return joinQCodeProcessName("renderer", normalizedTitle);
}

export function formatQCodeAgentProcessName(provider: string, workspacePath?: string): string {
  return joinQCodeProcessName("agent", provider, pickWorkspaceTag(workspacePath));
}

export function formatQCodeUtilityProcessName(name?: string, type = "utility"): string {
  return joinQCodeProcessName(type, name);
}
