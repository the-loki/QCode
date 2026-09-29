import { z } from "zod";
import type { CommandAgentSource } from "./command-types.js";
import type { QCodeProvider } from "./qcode-task-types-core.js";

export const QCODE_AGENT_PROVIDER = "glm" satisfies QCodeProvider;
export const QCODE_AGENT_PROVIDER_LABEL = "QCode Agent";
export const QCODE_COMMAND_AGENT_SOURCE = "qcodeAgent" satisfies CommandAgentSource;

export const qcodeAgentProviderSchema = z.literal(QCODE_AGENT_PROVIDER);

export const QCODE_COMMAND_AGENT_SOURCES = [
  QCODE_COMMAND_AGENT_SOURCE,
] as const satisfies readonly CommandAgentSource[];

export function normalizeAgentProviderToQCodeAgent(
  _provider?: QCodeProvider | null,
): QCodeProvider {
  return QCODE_AGENT_PROVIDER;
}

export function isQCodeAgentProvider(
  provider: QCodeProvider | null | undefined,
): provider is typeof QCODE_AGENT_PROVIDER {
  return provider === QCODE_AGENT_PROVIDER;
}
