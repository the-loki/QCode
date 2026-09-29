import { resolve } from "node:path";
import { createConfig } from "@qcode/adapters/config";
import { createNodeCustomCommandAdapter } from "@qcode/adapters/commands";
import type {
  CustomCommandContent,
  CustomCommandDiagnostic,
  CustomCommandLoadOutcome,
  Logger,
} from "@qcode/contracts";
import { resolveQCodePlugins } from "./plugins.js";
import { collectDisabledPaths } from "./skill-command-overrides.js";

export interface ListQCodeCustomCommandsOptions {
  env?: NodeJS.ProcessEnv;
  homeDirectory?: string;
  logger?: Logger;
  projectConfigPath?: string;
  skipUserConfig?: boolean;
  userConfigPath?: string;
  workingDirectory?: string;
}

export interface InspectQCodeCustomCommandOptions extends ListQCodeCustomCommandsOptions {
  name: string;
}

export interface QCodeCustomCommandInspection {
  command: CustomCommandContent;
  diagnostics: CustomCommandDiagnostic[];
}

export async function listQCodeCustomCommands(
  options: ListQCodeCustomCommandsOptions = {},
): Promise<CustomCommandLoadOutcome> {
  const discovery = createCustomCommandDiscovery(options);
  return await discovery.adapter.discoverCommands({
    workingDirectory: discovery.workingDirectory,
  });
}

export async function inspectQCodeCustomCommand(
  options: InspectQCodeCustomCommandOptions,
): Promise<QCodeCustomCommandInspection> {
  const discovery = createCustomCommandDiscovery(options);
  const workingDirectory = discovery.workingDirectory;
  const adapter = discovery.adapter;
  const outcome = await adapter.discoverCommands({ workingDirectory });
  const normalizedName = normalizeCommandName(options.name);
  if (!outcome.commands.some((command) => command.name === normalizedName)) {
    throw new Error(`Custom command not found: ${options.name}`);
  }

  return {
    command: await adapter.loadCommand({
      name: normalizedName,
      workingDirectory,
    }),
    diagnostics: outcome.diagnostics,
  };
}

export async function loadQCodeCustomCommand(
  options: InspectQCodeCustomCommandOptions,
): Promise<CustomCommandContent> {
  const discovery = createCustomCommandDiscovery(options);
  return await discovery.adapter.loadCommand({
    name: normalizeCommandName(options.name),
    workingDirectory: discovery.workingDirectory,
  });
}

function createCustomCommandDiscovery(options: ListQCodeCustomCommandsOptions) {
  const workingDirectory = resolve(options.workingDirectory ?? process.cwd());
  const configResult = createConfig({
    env: options.env,
    projectConfigPath: options.projectConfigPath,
    workingDirectory,
    skipUserConfig: options.skipUserConfig,
    userConfigPath: options.userConfigPath,
  });
  const pluginOutcome = resolveQCodePlugins({
    configResult,
    env: options.env,
    logger: options.logger,
    projectConfigPath: options.projectConfigPath,
    skipUserConfig: options.skipUserConfig,
    userConfigPath: options.userConfigPath,
    workingDirectory,
  });
  return {
    adapter: createNodeCustomCommandAdapter({
      extraResolvedRoots: pluginOutcome.commandRoots,
      disabledPaths: collectDisabledPaths(configResult.config.commandOverrides),
      homeDirectory: options.homeDirectory,
    }),
    workingDirectory,
  };
}

function normalizeCommandName(name: string): string {
  return name.trim().replace(/^\/+/, "").toLowerCase();
}
